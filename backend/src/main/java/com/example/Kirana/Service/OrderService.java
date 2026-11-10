package com.example.Kirana.Service;

import com.example.Kirana.DTOs.Requests.*;
import com.example.Kirana.DTOs.Response.*;
import com.example.Kirana.Entity.*;
import com.example.Kirana.Enums.*;
import com.example.Kirana.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

	private final NotificationService notificationService;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;

    // Customer creates order from cart
    public OrderResponse createOrder(String customerId, CreateOrderRequest request) {

        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Shop shop = shopRepository.findById(request.getShopId())
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        if (!shop.getIsOpen()) {
            throw new RuntimeException("Shop is currently closed");
        }

        Order order = Order.builder()
                .customer(customer)
                .shop(shop)
                .status(OrderStatus.PENDING)
                .customerNote(request.getCustomerNote())
                .paymentMode(PaymentMode.valueOf(
                    request.getPaymentMode() != null ? request.getPaymentMode() : "CASH"))
                .build();

        List<OrderItem> items = request.getItems().stream().map(itemReq -> {

            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException(
                        "Product not found: " + itemReq.getProductId()));

            BigDecimal unitPrice = product.getPricePerUnit();
            BigDecimal qty = new BigDecimal(itemReq.getQuantity());
            BigDecimal totalPrice = unitPrice.multiply(qty);

            return OrderItem.builder()
                    .order(order)
                    .product(product)
                    .itemName(product.getName())
                    .quantity(itemReq.getQuantity())
                    .note(itemReq.getNote())
                    .unitPrice(unitPrice)
                    .totalPrice(totalPrice)
                    .isAvailable(true)
                    .build();

        }).collect(Collectors.toList());

        // Calculate total order amount
        BigDecimal totalAmount = items.stream()
                .map(OrderItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setItems(items);
        order.setTotalAmount(totalAmount);

        orderRepository.save(order);
        
        notificationService.createNotification(
        	    shop.getOwner(),
        	    order,
        	    "New Order Received",
        	    customer.getName() + " has sent a new order with "
        	        + items.size() + " items."
        	);
        
        return mapToResponse(order);
    }

    // Customer views their orders
    public List<OrderResponse> getCustomerOrders(String customerId) {
        return orderRepository
                .findByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Shop owner views all shop orders
    public List<OrderResponse> getShopOrders(String shopId) {
        return orderRepository
                .findByShopIdOrderByCreatedAtDesc(shopId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Shop owner filters by status
    public List<OrderResponse> getShopOrdersByStatus(String shopId, String status) {
        return orderRepository
                .findByShopIdAndStatus(shopId, OrderStatus.valueOf(status))
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get single order detail
    public OrderResponse getOrderById(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToResponse(order);
    }

    // Shop owner updates order status
    public OrderResponse updateOrderStatus(String orderId, UpdateOrderStatusRequest request) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus newStatus = OrderStatus.valueOf(request.getStatus());

        // Validate status transition
        validateStatusTransition(order.getStatus(), newStatus);

        order.setStatus(newStatus);

        if (request.getRejectionReason() != null) {
            order.setRejectionReason(request.getRejectionReason());
        }

        orderRepository.save(order);
        
     // Notify customer about status change
        notificationService.notifyOrderStatus(order);
        
        return mapToResponse(order);
    }

    // Prevent invalid status jumps
    private void validateStatusTransition(OrderStatus current, OrderStatus next) {
        switch (current) {
            case PENDING:
                if (next != OrderStatus.ACCEPTED && next != OrderStatus.REJECTED)
                    throw new RuntimeException("Pending order can only be accepted or rejected");
                break;
            case ACCEPTED:
                if (next != OrderStatus.PREPARING)
                    throw new RuntimeException("Accepted order can only move to preparing");
                break;
            case PREPARING:
                if (next != OrderStatus.READY_FOR_PICKUP)
                    throw new RuntimeException("Preparing order can only move to ready for pickup");
                break;
            case READY_FOR_PICKUP:
                if (next != OrderStatus.COMPLETED)
                    throw new RuntimeException("Ready order can only move to completed");
                break;
            default:
                throw new RuntimeException("Order is already " + current.name());
        }
    }

    private OrderResponse mapToResponse(Order order) {

        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .itemName(item.getItemName())
                        .quantity(item.getQuantity())
                        .note(item.getNote())
                        .isAvailable(item.getIsAvailable())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .shopId(order.getShop().getId())
                .shopName(order.getShop().getName())
                .customerId(order.getCustomer().getId())
                .customerName(order.getCustomer().getName())
                .status(order.getStatus().name())
                .paymentMode(order.getPaymentMode().name())
                .totalAmount(order.getTotalAmount())
                .customerNote(order.getCustomerNote())
                .rejectionReason(order.getRejectionReason())
                .createdAt(order.getCreatedAt())
                .items(itemResponses)
                .build();
    }
}