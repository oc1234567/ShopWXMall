const { AppId } = require("./constant/app_id");

const API_BASE_URL = 'http://localhost:8889/api/';
module.exports = {
    IndexUrlAllGoods: API_BASE_URL + 'products', //全部商品
    IndexUrl: API_BASE_URL + 'shop-index', //首页
    IndexPosUrl: API_BASE_URL + 'index-pos', //首页位置信息
    GoodDetail: API_BASE_URL + 'products/view', //产品详情
    GoodColor: API_BASE_URL + 'product-color/view', //颜色
    GoodSize: API_BASE_URL + 'product-size/view', //尺寸
    GoodCount: API_BASE_URL + 'count-product/view', //库存

    MarketGoods: API_BASE_URL + 'market/view', //营销商品

    CustomerInfo: API_BASE_URL + 'customer', //查询用户
    CreateCustomerByWeixin: API_BASE_URL + 'customer/create', //注册用户

    CreateAddress: API_BASE_URL + 'customer-addr/create', //添加地址
    UpdateAddress: API_BASE_URL + 'customer-addr/update', //更新地址
    DeleteAddress: API_BASE_URL + 'customer-addr/delete', //删除地址
    CustomerAddressInfo: API_BASE_URL + 'customer-addr/view', //查询地址

    CreateCartProduct: API_BASE_URL + 'cart-product/create', //加入购物车
    UpdateCartProduct: API_BASE_URL + 'cart-product/update', //更新购物车
    DeleteCartProduct: API_BASE_URL + 'cart-product/delete', //删除购物车
    CartProductInfo: API_BASE_URL + 'cart-product', //查询购物车

    CreateOrder: API_BASE_URL + 'order/create', //添加订单
    DeleteOrder: API_BASE_URL + 'order/delete', //删除订单
    CustomerOrderInfo: API_BASE_URL + 'order/view', //订单详情
    CreateOrderDetail: API_BASE_URL + 'order-detail/create', //添加订单购物清单产品
    DeleteOrderDetail: API_BASE_URL + 'order-detail/delete', //删除订单购物清单产品
    CustomerOrderGoodInfo: API_BASE_URL + 'order-detail/view', //订单购物清单产品详情
    
    CategoryInfo: API_BASE_URL + 'product-category', //分类表
    CategoryGoods: API_BASE_URL + 'product-category/view', //分类商品
};
