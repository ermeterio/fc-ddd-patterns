import OrderItem  from "../../../../domain/checkout/entity/order_item";
import Order from "../../../../domain/checkout/entity/order";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async update(entity: Order): Promise<void> {    
    //Conventional Update not working
    // await OrderModel.update(
    //   {
    //     customer_id: entity.customerId,
    //     total: entity.total(),
    //     items: entity.items.map((item) => ({
    //       id: item.id,
    //       name: item.name,
    //       price: item.price,
    //       product_id: item.productId,
    //       quantity: item.quantity,
    //     })),
    //   },
    //   {
    //     where: {
    //       id: entity.id,
    //     },
    //   }, 
    // );
    //Using Alternative Update
    await OrderModel.destroy(
      {
        where: {
          id: entity.id,
        },
      }, 
    );    
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );    
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({ where: { id } });
    const orderItemModel = await OrderItemModel.findAll( { where: { order_id : orderModel.id }} );
    return new Order(orderModel.id, orderModel.customer_id, 
                orderItemModel.map((orderItem) => new OrderItem(orderItem.id, orderItem.name, orderItem.price, orderItem.product_id, orderItem.quantity)));
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll();
    const { Op } = require("sequelize");
    let idsOrders = new Array<string>();
    idsOrders  = orderModels.map((ids) => ids.id);
    const orderItemModel = await OrderItemModel.findAll( { where : { order_id : {[Op.in] : idsOrders } } } );
    return orderModels.map((orderModel) =>      
      new Order(orderModel.id, orderModel.customer_id,        
        orderItemModel. map( (orderItem) => new OrderItem(orderItem.id, orderItem.name, orderItem.price, orderItem.product_id, orderItem.quantity), { where: { order_id : orderModel.id }}))
    );
  }

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }
}
