import { ApiProperty } from "@nestjs/swagger";

class StudentDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ description: "학생 이름", example: "이상민" })
  studentName: string;

  @ApiProperty({ description: "학번", example: "3211" })
  studentId: string;
}

export default class ReservationInfoDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ description: "대표자 이름", example: "이상민" })
  leaderName: string;

  @ApiProperty({ description: "대표자 학번", example: "3211" })
  leaderId: string;

  @ApiProperty({ description: "예약 날짜", example: "2024-05-21" })
  reservationDate: string;

  @ApiProperty({ description: "학생들 정보", type: StudentDto, isArray: true })
  reservationStudents: StudentDto[];
}