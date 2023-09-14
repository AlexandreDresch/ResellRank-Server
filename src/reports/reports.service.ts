import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { User } from 'src/users/entities/user.entity';
import { GetEstimateDto } from './dto/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private repository: Repository<Report>,
  ) {}

  create(data: CreateReportDto, user: User): Promise<Report> {
    const report = this.repository.create(data);
    report.user = user;

    return this.repository.save(report);
  }

  createEstimate(data: GetEstimateDto) {
    return this.repository
      .createQueryBuilder()
      .select(['AVG(price) as price', 'kilometers'])
      .where('brand = :brand', { brand: data.brand })
      .andWhere('model = :model', { model: data.model })
      .andWhere('lng - :lng BETWEEN -10 AND 10', { lng: data.lng })
      .andWhere('lat - :lat BETWEEN -10 AND 10', { lat: data.lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year: data.year })
      .andWhere('approved IS TRUE')
      .groupBy('kilometers')
      .orderBy('ABS(kilometers - :kilometers)', 'DESC')
      .setParameters({ kilometers: data.kilometers })
      .limit(3)
      .getRawOne();
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  async changeApproval(id: number, approved: boolean) {
    if (!id) {
      throw new NotFoundException('Report not found.');
    }

    const report = await this.repository.findOneBy({ id: id });

    if (!report) {
      throw new NotFoundException('Report not found.');
    }

    report.approved = approved;

    return this.repository.save(report);
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
