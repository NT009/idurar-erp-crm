import { Injectable, NotFoundException } from '@nestjs/common';
import { MongoService } from '../common/mongo/mongo.service';
import { CreateWebhookQueryDto } from './dto/queries.dto';

@Injectable()
export class IntegrationService {
  constructor(private readonly mongoService: MongoService) {}
  async getSummary() {
    const queriesCollection = this.mongoService.getCollection('queries');
    const invoicesCollection = this.mongoService.getCollection('invoices');

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    //Querires count
    const queriesStatus = await queriesCollection
      .aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const queryStatusCounts = queriesStatus.reduce(
      (acc, item) => {
        acc[item._id] = item.count;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Querires this month
    const queryCreatedThisMonth = await queriesCollection.countDocuments({
      created: {
        $gte: startOfMonth,
        $lt: startOfNextMonth,
      },
    });

    // invoice count by status
    const invoiceStatus = await invoicesCollection
      .aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const invoiceStatusCounts = invoiceStatus.reduce(
      (acc, item) => {
        acc[item._id] = item.count;
        return acc;
      },
      {} as Record<string, number>,
    );
    // --------- INVOICE PAYMENT STATUS COUNT ---------
    const paymentStatus = await invoicesCollection
      .aggregate([
        {
          $group: {
            _id: '$paymentStatus',
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const paymentStatusCounts = ['unpaid', 'paid', 'partially'].reduce(
      (acc, key) => {
        acc[key] = paymentStatus.find((item) => item._id === key)?.count || 0;
        return acc;
      },
      {} as Record<string, number>,
    );
    //invoices this month
    const invoiceCreatedThisMonth = await invoicesCollection.countDocuments({
      created: {
        $gte: startOfMonth,
        $lt: startOfNextMonth,
      },
    });
    // Expired invoices (unpaid or partially paid & expiredDate < now)
    const expiredInvoicesCount = await invoicesCollection.countDocuments({
      paymentStatus: { $in: ['unpaid', 'partially'] },
      expiredDate: { $lt: now },
    });
    return {
      message: 'Summary fetched successfully',
      statusCode: 200,
      data: {
        query: {
          statusCount: queryStatusCounts,
          createdThisMonth: queryCreatedThisMonth,
        },
        invoice: {
          statusCount: invoiceStatusCounts,
          createdThisMonth: invoiceCreatedThisMonth,
          paymentStatusCount: paymentStatusCounts,
          expired: expiredInvoicesCount,
        },
      },
    };
  }

  async createQuery(dto: CreateWebhookQueryDto) {
    const now = new Date();
    const payload = {
      ...dto,
      created: now,
      updated: now,
      removed: false,
    };

    const collection = this.mongoService.getCollection('queries');
    const result = await collection.insertOne(payload);
    return {
      message: 'Query created successfully',
      data: result,
    };
  }
}
