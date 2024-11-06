import { CreateOrderDto } from './dto/create-order.dto';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './entities/order.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}
  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      const { userId, orderItems, shippingAddress, totalPrice, orderStatus } =
        createOrderDto;

      // console.log(orderItems);
      // Find the user by ID
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new NotFoundException({ message: 'User not found' });
      }

      // Get product IDs from order items
      const productIds = orderItems.map((item) => item.productId);

      // Find products by IDs
      const products = await this.productService.findAllList(productIds);

      // Check stock availability for each product item
      for (const item of orderItems) {
        const product = products.find(
          (p) => p._id.toString() === item.productId,
        );
        if (!product) {
          throw new NotFoundException({
            message: `Product not found for item ${item.productTitle}`,
          });
        }
        const stockDetail = product.stockDetails.find(
          (stock) => stock.colorCode === item.color,
        );
        if (!stockDetail) {
          throw new BadRequestException(
            `Color ${item.color} not available for product ${item.productTitle}`,
          );
        }
        const sizeDetail = stockDetail.details.find(
          (detail) => detail.size === item.size,
        );
        if (!sizeDetail || sizeDetail.quantity < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for size ${item.size} of product ${item.productTitle}, just have ${sizeDetail ? sizeDetail.quantity : 0} in stock.`,
          );
        }
      }

      // Create a new order
      const newOrder = new this.orderModel({
        userId,
        orderItems,
        shippingAddress,
        totalPrice,
        orderStatus: orderStatus || 'pending',
        isPayment: false,
      });

      const savedOrder = await newOrder.save();
      // console.log("====================");
      // console.log(savedOrder);
      // Update stock details
      for (const item of orderItems) {
        const product = await this.productService.findOne(item.productId);
        const stockDetail = product.stockDetails.find(
          (stock) => stock.colorCode === item.color,
        );
        const sizeDetail = stockDetail.details.find(
          (detail) => detail.size === item.size,
        );
        sizeDetail.quantity -= item.quantity;
        product.stock -= item.quantity; // Decrease total stock
        // console.log(product);
        return savedOrder;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getOrdersByUserId(userId: string) {
    const orders2 = await this.orderModel.find({ userId });

    if (!orders2.length) {
      throw new NotFoundException('No orders found');
    }

    return orders2;
  }

  async getAllOrders(): Promise<OrderDocument[]> {
    return this.orderModel.find().exec();
  }

  async approveOrder(orderId: string) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.orderStatus = 'shipped';
    const updatedOrder = await order.save();
    return updatedOrder;
  }

  async cancelOrder(orderId: string) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Reverse the stock quantity adjustments
    for (const item of order.orderItems) {
      const product = await this.productService.findOne(
        item.productId.toString(),
      );
      const stockDetail = product.stockDetails.find(
        (stock) => stock.colorCode === item.color,
      );
      const sizeDetail = stockDetail.details.find(
        (detail) => detail.size === item.size,
      );
      sizeDetail.quantity += item.quantity;

      await product.save();
    }
  }

  async completedOrder(orderId: string) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.orderStatus = 'completed';
    order.isPayment = true;
    const updatedOrder = await order.save();
    return updatedOrder;
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (status === 'shipping') {
      order.orderStatus = 'shipping';
    } else if (status === 'completed') {
      order.orderStatus = 'completed';
      order.isPayment = true;
    } else if (status === 'cancelled') {
      order.orderStatus = 'cancelled';
      // Update stock details when an order is cancelled
      for (const item of order.orderItems) {
        const product = await this.productService.findOne(
          item.productId.toString(),
        );
        const stockDetail = product.stockDetails.find(
          (stock) => stock.colorCode === item.color,
        );
        const sizeDetail = stockDetail.details.find(
          (detail) => detail.size === item.size,
        );
        sizeDetail.quantity += item.quantity;
        product.stock += item.quantity; // Restore total stock

        // Add back the size if it was removed (if applicable)
        if (!stockDetail.details.find((detail) => detail.size === item.size)) {
          stockDetail.details.push({
            size: item.size,
            quantity: item.quantity,
          });
        }

        // Add back the color if it was removed (if applicable)
        if (
          !product.stockDetails.find((stock) => stock.colorCode === item.color)
        ) {
          product.stockDetails.push({
            colorCode: item.color,
            details: [{ size: item.size, quantity: item.quantity }],
          });
        }

        await product.save();
      }
    }
    const updatedOrder = await order.save();
    return updatedOrder;
  }

  async getTopProducts() {
    const orders = await this.orderModel
      .find({ orderStatus: 'completed' })
      .populate('orderItems.productId');

    const productSales = {};

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const productId = item.productId._id.toString();
        const key = `${productId}_${item.color}_${item.size}`;

        if (!productSales[key]) {
          productSales[key] = {
            productId: productId,
            productTitle: item.productTitle,
            productThumbnail: item.thumbnail,
            productSize: item.size,
            productColor: item.color,
            quantity: 0,
          };
        }

        productSales[key].quantity += item.quantity;
      });
    });

    const sortedProducts = Object.values(productSales).sort(
      (a: any, b: any) => b.quantity - a.quantity,
    );
    const topProducts = sortedProducts.slice(0, 10);

    return topProducts;
  }
}
