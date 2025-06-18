import React, { useContext, useState, useMemo, useEffect } from "react";
import "./Orders.css";
import FirebaseContext from "../../context/Firebase/FirebaseContext";
import LoginWarn from "../LoginWarn/LoginWarn";

const Orders = () => {
  const { user } = useContext(FirebaseContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingOrders, setUpdatingOrders] = useState(new Set());

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      const data = await response.json();
      // console.log(data);
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchOrders();

  }, [user]);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrders((prev) => new Set(prev).add(orderId));

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          body: JSON.stringify({ status: newStatus }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update the order in the local state
        fetchOrders();
      } else {
        console.error("Failed to update order status:", data.message);
        alert("Failed to update order status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status. Please try again.");
    } finally {
      setUpdatingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter(
      (order) => order.status === "completed"
    ).length;
    const pendingOrders = orders.filter(
      (order) => order.status === "pending"
    ).length;
    const processingOrders = orders.filter(
      (order) => order.status === "processing"
    ).length;
    const outForDeliveryOrders = orders.filter(
      (order) => order.status === "out-for-delivery"
    ).length;
    const deliveredOrders = orders.filter(
      (order) => order.status === "delivered"
    ).length;
    const totalRevenue = orders
      .filter((order) => order.paymentStatus === "paid")
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalOrders,
      completedOrders,
      pendingOrders,
      processingOrders,
      outForDeliveryOrders,
      deliveredOrders,
      totalRevenue,
    };
  }, [orders]);

  // Filter orders based on status, payment, and search
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesPayment =
        paymentFilter === "all" || order.paymentStatus === paymentFilter;
      const matchesSearch =
        searchQuery === "" ||
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((item) =>
          item.item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesStatus && matchesPayment && matchesSearch;
    });
  }, [orders, statusFilter, paymentFilter, searchQuery]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatOrderId = (id) => {
    return `#${id.slice(-8).toUpperCase()}`;
  };

  const getStatusOptions = (currentStatus) => {
    const statusFlow = {
      pending: ["processing", "cancelled"],
      processing: ["out-for-delivery", "cancelled"],
      "out-for-delivery": ["delivered", "cancelled"],
      delivered: [],
      cancelled: [],
      completed: [],
    };

    // return statusFlow[currentStatus] || [];
    return [
      "pending",  
      "processing",
      "out-for-delivery",
      "delivered",
      "cancelled",
    ];
  };
  if (!user) return <LoginWarn />;
  if (loading) {
    return (
      <div className="orders-container">
        <div className="orders-loading-container">
          <div className="orders-loading-spinner"></div>
          <div className="orders-loading-text">Loading orders...</div>
        </div>
      </div>
    );
  }


  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1 className="orders-title">Order Management</h1>
        <p className="orders-subtitle">Track and manage all customer orders</p>
      </div>

      {/* Statistics Cards */}
      <div className="orders-stats">
        <div className="orders-stat-card orders-total-orders">
          <div className="orders-stat-value">{stats.totalOrders}</div>
          <div className="orders-stat-label">Total Orders</div>
        </div>
        <div className="orders-stat-card orders-pending">
          <div className="orders-stat-value">{stats.pendingOrders}</div>
          <div className="orders-stat-label">Pending</div>
        </div>
        <div className="orders-stat-card orders-processing">
          <div className="orders-stat-value">{stats.processingOrders}</div>
          <div className="orders-stat-label">Processing</div>
        </div>
        <div className="orders-stat-card orders-out-for-delivery">
          <div className="orders-stat-value">{stats.outForDeliveryOrders}</div>
          <div className="orders-stat-label">Out for Delivery</div>
        </div>
        <div className="orders-stat-card orders-delivered">
          <div className="orders-stat-value">{stats.deliveredOrders}</div>
          <div className="orders-stat-label">Delivered</div>
        </div>
        <div className="orders-stat-card orders-revenue">
          <div className="orders-stat-value">${stats.totalRevenue}</div>
          <div className="orders-stat-label">Total Revenue</div>
        </div>
      </div>

      {/* Filters */}
      <div className="orders-filters-section">
        <div className="orders-filters-row">
          <div className="orders-filter-group">
            <label className="orders-filter-label">Order Status</label>
            <select
              className="orders-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="out-for-delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="orders-filter-group">
            <label className="orders-filter-label">Payment Status</label>
            <select
              className="orders-filter-select"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          <div className="orders-filter-group">
            <label className="orders-filter-label">Search Orders</label>
            <input
              type="text"
              className="orders-search-input"
              placeholder="Search by order ID or item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="orders-empty-state">
          <h3>No orders found</h3>
          <p>No orders match your current filter criteria.</p>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map((order) => {
            const availableStatuses = getStatusOptions(order.status);
            const isUpdating = updatingOrders.has(order._id);

            return (
              <div key={order._id} className="orders-card">
                <div className="orders-header-section">
                  <div>
                    <div className="orders-id">{formatOrderId(order._id)}</div>
                    <div className="orders-date">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div
                    className={`orders-status-badge orders-status-${order.status}`}
                  >
                    {order.status.replace("-", " ")}
                  </div>
                </div>

                <div className="orders-payment-status">
                  <span>Payment:</span>
                  <span
                    className={`orders-payment-badge orders-payment-${order.paymentStatus}`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>

                {/* Status Update Section */}
                {/* {availableStatuses.length > 0 && ( */}
                {availableStatuses.length > 0 && (
                  <div className="orders-status-update-section">
                    <label className="orders-status-update-label">
                      Update Status:
                    </label>
                    <select
                      className="orders-status-select"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          updateOrderStatus(order._id, e.target.value);
                          e.target.value = "";
                        }
                      }}
                      disabled={isUpdating}
                    >
                      <option value="">Select new status...</option>
                      {availableStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status
                            .replace("-", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                    {isUpdating && (
                      <button className="orders-update-btn" disabled>
                        Updating...
                      </button>
                    )}
                  </div>
                )}

                <div className="orders-items">
                  <div className="orders-items-header">
                    <span>🍽️</span>
                    <span>Items ({order.items.length})</span>
                  </div>
                  <div className="orders-items-list">
                    {order.items.map((orderItem) => (
                      <div key={orderItem._id} className="orders-item">
                        <img
                          src={orderItem.item.image}
                          alt={orderItem.item.name}
                          className="orders-item-image"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/50x50?text=No+Image";
                          }}
                        />
                        <div className="orders-item-details">
                          <div className="orders-item-name">
                            {orderItem.item.name}
                          </div>
                          <div className="orders-item-meta">
                            <span className="orders-item-quantity">
                              Qty: {orderItem.quantity}
                            </span>
                            <span className="orders-item-price">
                              ${orderItem.item.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="orders-total">
                  <span className="orders-total-label">Total Amount:</span>
                  <span className="orders-total-amount">
                    ${order.totalAmount}
                  </span>
                </div>

                <div className="orders-actions">
                  <button className="orders-action-btn orders-btn-view">
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
