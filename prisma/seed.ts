import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { BookingStatus, PrismaClient, RoleCode } from '@prisma/client';

import 'dotenv/config';

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST as string,
  user: process.env.DATABASE_USER as string,
  password: process.env.DATABASE_PASSWORD as string,
  database: process.env.DATABASE_NAME as string,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

function todayAt(hour: number, minute = 0) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}

async function main() {
  console.log('Start seeding...');

  await prisma.booking.deleteMany();
  await prisma.user.deleteMany();
  await prisma.meetingRoom.deleteMany();
  await prisma.role.deleteMany();
  await prisma.department.deleteMany();

  const adminDepartment = await prisma.department.create({
    data: { name: '行政部' },
  });
  const engineeringDepartment = await prisma.department.create({
    data: { name: '技术部' },
  });
  const productDepartment = await prisma.department.create({
    data: { name: '产品部' },
  });

  const employeeRole = await prisma.role.create({
    data: { code: RoleCode.EMPLOYEE, name: '普通员工' },
  });
  const departmentAdminRole = await prisma.role.create({
    data: { code: RoleCode.DEPT_ADMIN, name: '部门管理员' },
  });
  const systemAdminRole = await prisma.role.create({
    data: { code: RoleCode.SYS_ADMIN, name: '系统管理员' },
  });

  const adminUser = await prisma.user.create({
    data: {
      openid: 'wx_openid_admin_001',
      employeeNo: 'A1001',
      name: '张敏',
      phone: '13800000001',
      departmentId: adminDepartment.id,
      roleId: systemAdminRole.id,
    },
  });
  const techLeadUser = await prisma.user.create({
    data: {
      openid: 'wx_openid_dev_001',
      employeeNo: 'T1001',
      name: '李工',
      phone: '13800000002',
      departmentId: engineeringDepartment.id,
      roleId: departmentAdminRole.id,
    },
  });
  const developerUser = await prisma.user.create({
    data: {
      openid: 'wx_openid_dev_002',
      employeeNo: 'T1002',
      name: '王雪',
      phone: '13800000003',
      departmentId: engineeringDepartment.id,
      roleId: employeeRole.id,
    },
  });
  const productUser = await prisma.user.create({
    data: {
      openid: 'wx_openid_pm_001',
      employeeNo: 'P1001',
      name: '陈晨',
      phone: '13800000004',
      departmentId: productDepartment.id,
      roleId: employeeRole.id,
    },
  });

  const roomA101 = await prisma.meetingRoom.create({
    data: {
      name: 'A101',
      location: '1号楼 1层',
      capacity: 8,
      status: 'ENABLED',
    },
  });
  const roomA201 = await prisma.meetingRoom.create({
    data: {
      name: 'A201',
      location: '1号楼 2层',
      capacity: 12,
      status: 'ENABLED',
    },
  });
  const roomB301 = await prisma.meetingRoom.create({
    data: {
      name: 'B301',
      location: '2号楼 3层',
      capacity: 20,
      status: 'ENABLED',
    },
  });
  const roomC401 = await prisma.meetingRoom.create({
    data: {
      name: 'C401',
      location: '总部大楼 4层',
      capacity: 30,
      status: 'DISABLED',
    },
  });

  await prisma.booking.createMany({
    data: [
      {
        startTime: todayAt(9, 0),
        endTime: todayAt(10, 0),
        purpose: '技术部晨会',
        attendeeCount: 6,
        status: BookingStatus.APPROVED,
        approvalRemark: '部门管理员已审批通过',
        approvalTime: new Date(),
        userId: techLeadUser.id,
        roomId: roomA101.id,
      },
      {
        startTime: todayAt(10, 30),
        endTime: todayAt(11, 30),
        purpose: '会议室预订小程序需求评审',
        attendeeCount: 10,
        status: BookingStatus.PENDING,
        userId: productUser.id,
        roomId: roomA201.id,
      },
      {
        startTime: todayAt(14, 0),
        endTime: todayAt(15, 30),
        purpose: '预约冲突处理方案讨论',
        attendeeCount: 12,
        status: BookingStatus.REJECTED,
        approvalRemark: '参会人数超过会议室可容纳人数',
        approvalTime: new Date(),
        userId: developerUser.id,
        roomId: roomA101.id,
      },
      {
        startTime: todayAt(16, 0),
        endTime: todayAt(17, 0),
        purpose: '行政周例会',
        attendeeCount: 8,
        status: BookingStatus.CANCELLED,
        userId: adminUser.id,
        roomId: roomB301.id,
      },
      {
        startTime: todayAt(18, 0),
        endTime: todayAt(19, 0),
        purpose: '客户接待与会议室演示',
        attendeeCount: 16,
        status: BookingStatus.FINISHED,
        approvalRemark: '会议已结束并完成签到',
        approvalTime: new Date(),
        userId: productUser.id,
        roomId: roomB301.id,
      },
    ],
  });

  console.log('Seed completed.');
  console.log('Departments: 3');
  console.log('Roles: 3');
  console.log('Users: 4');
  console.log(`Rooms: 4, including disabled room ${roomC401.name}`);
  console.log('Bookings: 5');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
