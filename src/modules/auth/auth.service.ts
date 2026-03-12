import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { WxService } from '@/modules/wx/wx.service';
import { PrimsaService } from '@/prisma/prisma.service';

import { BindEmployeeDto } from './dto/bindEmployee.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private wxService: WxService,
    private prisma: PrimsaService,
  ) {}

  async wxLogin(code: string) {
    const wxUser = await this.wxService.code2Session(code);
    const { openid } = wxUser;

    // 微信登录的唯一身份是 openid，先查本地是否已有绑定完成的用户。
    const user = await this.prisma.user.findUnique({
      where: {
        openid,
      },
      include: {
        role: true,
        department: true,
      },
    });

    // 没查到用户，或者用户还没有工号/角色，都说明还没完成员工绑定。
    if (!user || !user.employeeNo || !user.role) {
      // 给前端一个短期 bindToken，后续调用 bindEmployee 时用它确认当前微信身份。
      const bindToken = await this.jwtService.signAsync(
        {
          openid,
          purpose: 'bind',
        },
        {
          expiresIn: '10m',
        },
      );

      return {
        needBind: true,
        bindToken,
      };
    }

    // 已经绑定完成后，直接签发正常登录 accessToken。
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        openid,
        purpose: 'access',
      },
      {
        expiresIn: '7d',
      },
    );

    return {
      needBind: false,
      accessToken,
      userInfo: {
        id: user.id,
        name: user.name,
        employeeNo: user.employeeNo,
        phone: user.phone,
        departmentId: user.departmentId,
        roleCode: user.role.code,
      },
    };
  }

  async bindEmployee(dto: BindEmployeeDto) {
    let payload: { openid: string; purpose: string };

    try {
      // bindToken 只用于“微信登录后，正式绑定前”的短期身份确认。
      payload = await this.jwtService.verifyAsync(dto.bindToken);
    } catch {
      throw new UnauthorizedException('绑定凭证已失效');
    }

    if (payload.purpose !== 'bind') {
      throw new UnauthorizedException('无效绑定凭证');
    }

    // 绑定流程涉及多张表，放进事务里，避免出现部分成功的脏数据。
    const finalUser = await this.prisma.$transaction(async (tx) => {
      // 这些检查互不依赖，合并并发查询可以减少数据库往返。
      const [existedByEmployeeNo, existingUser, department, employeeRole] =
        await Promise.all([
          tx.user.findUnique({
            where: { employeeNo: dto.employeeNo },
          }),
          tx.user.findUnique({
            where: { openid: payload.openid },
          }),
          tx.department.findUnique({
            where: { id: dto.departmentId },
          }),
          tx.role.findUnique({
            where: { code: 'EMPLOYEE' },
          }),
        ]);

      if (!department) {
        throw new BadRequestException('部门不存在');
      }

      if (!employeeRole) {
        throw new InternalServerErrorException('系统未初始化员工角色');
      }

      if (
        existedByEmployeeNo &&
        existedByEmployeeNo.openid !== payload.openid
      ) {
        throw new UnauthorizedException('该工号已绑定其他账号');
      }

      if (existingUser?.employeeNo) {
        throw new UnauthorizedException('当前微信账号已完成绑定');
      }

      // 以 openid 作为唯一键：
      // 首次绑定时创建用户；已存在未绑定用户时补全员工资料并写入单一角色。
      const user = await tx.user.upsert({
        where: { openid: payload.openid },
        update: {
          employeeNo: dto.employeeNo,
          name: dto.name,
          phone: dto.phone,
          departmentId: dto.departmentId,
          roleId: employeeRole.id,
        },
        create: {
          openid: payload.openid,
          employeeNo: dto.employeeNo,
          name: dto.name,
          phone: dto.phone,
          departmentId: dto.departmentId,
          roleId: employeeRole.id,
        },
      });

      // 再查一次完整用户，返回最新的部门和角色信息给前端。
      return tx.user.findUniqueOrThrow({
        where: { id: user.id },
        include: {
          role: true,
          department: true,
        },
      });
    });

    if (!finalUser.role) {
      throw new InternalServerErrorException('用户角色缺失');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        sub: finalUser.id,
        openid: finalUser.openid,
        purpose: 'access',
      },
      {
        expiresIn: '7d',
      },
    );

    return {
      accessToken,
      userInfo: {
        id: finalUser.id,
        name: finalUser.name,
        employeeNo: finalUser.employeeNo,
        phone: finalUser.phone,
        departmentId: finalUser.departmentId,
        roleCode: finalUser.role.code,
      },
    };
  }
}
