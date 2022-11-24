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

    const orderModel = await orderRepository.find(order.id);

    const test = JSON.stringify({
      _id: "123",
      _customerId: "123",      
      _items: [
        {
          _id: ordemItem.id,
          _name: ordemItem.name,
          _price: ordemItem.price,
          _productId: "123",
          _quantity: ordemItem.quantity,          
        },
      ],
      _total: order.total(),
    })

    expect(JSON.stringify(orderModel)).toStrictEqual(test);
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

    const order = new Order("123", "123", [ordemItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await orderRepository.find(order.id);
        
    const test = JSON.stringify({
      _id: "123",
      _customerId: "123",      
      _items: [
        {
          _id: ordemItem.id,
          _name: ordemItem.name,
          _price: ordemItem.price,
          _productId: "123",
          _quantity: ordemItem.quantity,          
        },
      ],
      _total: order.total(),
    })

    expect(JSON.stringify(orderModel)).toStrictEqual(test);
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

    const ordemItem1 = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("1", "1", [ordemItem1]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    var ordemItem2 = new OrderItem(
      "2",
      product_2.name,
      product_2.price,
      product_2.id,
      2
    );

    const order2 = new Order("2", "1", [ordemItem2]);
    await orderRepository.create(order2);

    const orderModels = await orderRepository.findAll();

    const test = JSON.stringify([{   
      _id: "1",     
      _customerId: "1", 
      _items: [
        {
          _id: "1",
          _name: ordemItem1.name,
          _price: ordemItem1.price,          
          _productId: "1",
          _quantity: ordemItem1.quantity,          
        },
      ],
      _total: order.total(),},
      {
        _id: "2",       
        _customerId: "1",   
        _items: [
          {
            _id: "2",
            _name: ordemItem2.name,
            _price: ordemItem2.price,           
            _productId: "2",
            _quantity: ordemItem2.quantity,            
          },
        ],
        _total: order2.total(),
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
    const orderRepository = new OrderRepository();
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

    const orderModel = await orderRepository.find(order.id);

    var test = JSON.stringify({
      _id: "123",
      _customerId: "123",     
      _items: [
        {
          _id: newOrdemItem.id,
          _name: newOrdemItem.name,
          _price: newOrdemItem.price,         
          _productId: "321",
          _quantity: newOrdemItem.quantity,           
        },
      ],
      _total: order.total(),
    });
    
    expect(JSON.stringify(orderModel)).toStrictEqual(test);

  });

  });
