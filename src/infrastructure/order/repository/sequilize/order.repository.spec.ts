import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [ordemItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should find a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    var order = new Order("123", "123", [ordemItem]);
    var orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });

  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 10);
    const product_2 = new Product("2", "Product 2", 20);
    await productRepository.create(product);
    await productRepository.create(product_2);

    var ordemItem1 = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    var order = new Order("1", "1", [ordemItem1]);
    var orderRepository = new OrderRepository();
    await orderRepository.create(order);

    var ordemItem2 = new OrderItem(
      "2",
      product_2.name,
      product_2.price,
      product_2.id,
      2
    );

    var order2 = new Order("2", "1", [ordemItem2]);
    await orderRepository.create(order2);

    const orderModels = await OrderModel.findAll({include: ["items"]});

    let test = JSON.stringify([{   
      id: "1",     
      customer_id: "1",        
      total: order.total(),
      items: [
        {
          id: "1",
          product_id: "1",
          order_id: "1",
          quantity: ordemItem1.quantity,
          name: ordemItem1.name,
          price: ordemItem1.price,
        },
      ]},{
        id: "2",       
        customer_id: "1",             
        total: order2.total(),
        items: [
          {
            id: "2",
            product_id: "2",
            order_id: "2",
            quantity: ordemItem2.quantity,
            name: ordemItem2.name,
            price: ordemItem2.price,
          },
        ]
      }]);
     
    expect(JSON.stringify(orderModels)).toStrictEqual(test);
  });


  it("should update a existing order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );
    var order = new Order("123", "123", [ordemItem]);
    var orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const newProduct = new Product("321", "Product 2", 100);
    await productRepository.create(newProduct);

    const newOrdemItem = new OrderItem(
      "2",
      newProduct.name,
      newProduct.price,
      newProduct.id,
      2
    );
    order = new Order("123", "123", [newOrdemItem]);
    await orderRepository.update(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    var test = JSON.stringify({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: newOrdemItem.id,
          product_id: "321",
          order_id: "123",
          quantity: newOrdemItem.quantity,
          name: newOrdemItem.name,
          price: newOrdemItem.price,          
        },
      ],
    });    
    expect(JSON.stringify(orderModel)).toStrictEqual(test);

  });
});
