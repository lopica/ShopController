import { Controller, Post, Get, Put, Param, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto'; // Assume you have a DTO for creating orders

@Controller('order') // Base path for orders
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Create order
  @Post('create-order')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  // Get orders by user ID
  @Get('user-orders/:id')
  async getOrdersByUserId(@Param('id') userId: string) {
    return this.orderService.getOrdersByUserId(userId);
  }

  // Get all orders
  @Get('all-orders')
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  // Get all users (for admin/seller)
  // Uncomment if needed and add corresponding service method
  // @Get('all-users')
  // async getAllUsers() {
  //   return this.orderService.getAllUsers();
  // }

  // Approve order (change status from pending to shipped)
  @Post('approve-order')
  async approveOrder(@Body('orderId') orderId: string) {
    return this.orderService.approveOrder(orderId);
  }

  // Cancel order (user cancels their order)
  @Post('cancel-order')
  async cancelOrder(@Body('orderId') orderId: string) {
    return this.orderService.cancelOrder(orderId);
  }

  // User payment (mark order as completed)
  @Post('user-payment')
  async completedOrder(@Body('orderId') orderId: string) {
    return this.orderService.completedOrder(orderId);
  }

  // Update order status and isPayment by order id
  @Put('status/:id')
  async statusOrder(@Param('id') orderId: string, @Body() {status}) {
    return this.orderService.updateOrderStatus(orderId, status);
  }

  // Get top products
  @Get('top-products')
  async getTopProducts() {
    return this.orderService.getTopProducts();
  }
}
