// ==================================
// CUSTOMER MANAGEMENT - CRUD
// ==================================

const customerForm = document.getElementById('customerForm');

if (customerForm) {

    const customerTable = document.getElementById('customerTable');

    // READ - DISPLAY CUSTOMERS
    async function loadCustomers() {

        try {
            const response = await fetch('/api/customers');

            if (!response.ok) {
                throw new Error('Unable to load customers');
            }

            const customers = await response.json();

            customerTable.innerHTML = '';

            customers.forEach(customer => {

                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${customer.customer_id}</td>
                    <td>${escapeHTML(customer.name)}</td>
                    <td>${escapeHTML(customer.phone)}</td>
                    <td>${escapeHTML(customer.email || '')}</td>
                    <td>${escapeHTML(customer.address || '')}</td>
                    <td>
                        <button class="edit-btn"
                            onclick="editCustomer(${customer.customer_id})">
                            Edit
                        </button>

                        <button class="delete-btn"
                            onclick="deleteCustomer(${customer.customer_id})">
                            Delete
                        </button>
                    </td>
                `;

                customerTable.appendChild(row);
            });

        } catch (error) {
            alert(error.message);
        }
    }

    // Escape customer text before displaying it
    function escapeHTML(value) {
        return String(value ?? '').replace(/[&<>"']/g, character => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[character]);
    }

    // CREATE AND UPDATE CUSTOMER
    customerForm.addEventListener('submit', async function(event) {

        event.preventDefault();

        const customer_id = document.getElementById('customer_id').value;

        const customer = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value
        };

        try {

            let url = '/api/customers';
            let method = 'POST';

            if (customer_id) {
                url = `/api/customers/${customer_id}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customer)
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const result = await response.json();

            alert(result.message);

            resetForm();
            loadCustomers();

        } catch (error) {
            alert('Error: ' + error.message);
        }

    });

    // UPDATE - GET CUSTOMER DETAILS
    window.editCustomer = async function(id) {

        try {

            const response = await fetch('/api/customers');

            if (!response.ok) {
                throw new Error('Unable to get customer details');
            }

            const customers = await response.json();

            const customer = customers.find(c => c.customer_id === id);

            if (!customer) {
                alert('Customer not found');
                return;
            }

            document.getElementById('customer_id').value = customer.customer_id;
            document.getElementById('name').value = customer.name;
            document.getElementById('phone').value = customer.phone;
            document.getElementById('email').value = customer.email || '';
            document.getElementById('address').value = customer.address || '';

            document.getElementById('submitBtn').textContent = 'Update Customer';

            document.getElementById('cancelBtn').style.display = 'inline-block';

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        } catch (error) {
            alert(error.message);
        }
    };

    // DELETE CUSTOMER
    window.deleteCustomer = async function(id) {

        const confirmDelete = confirm(
            'Are you sure you want to delete this customer?'
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(`/api/customers/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const result = await response.json();

            alert(result.message);

            loadCustomers();

        } catch (error) {
            alert('Delete failed: ' + error.message);
        }
    };

    // RESET FORM
    window.resetForm = function() {

        customerForm.reset();

        document.getElementById('customer_id').value = '';

        document.getElementById('submitBtn').textContent = 'Add Customer';

        document.getElementById('cancelBtn').style.display = 'none';

    };

    // LOAD CUSTOMERS WHEN PAGE OPENS
    loadCustomers();

}
// SERVICES CRUD OPERATIONS

const serviceForm = document.getElementById('serviceForm');

if (serviceForm) {
    const serviceTable = document.getElementById('serviceTable');

    // Display all services
    async function loadServices() {
        try {
            const response = await fetch('/api/services');

            if (!response.ok) {
                throw new Error('Unable to fetch services');
            }

            const services = await response.json();
            serviceTable.innerHTML = '';

            services.forEach(service => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${service.service_id}</td>
                    <td>${escapeServiceHTML(service.service_name)}</td>
                    <td>₹${Number(service.price_per_kg).toFixed(2)}</td>
                    <td>${escapeServiceHTML(service.description || '')}</td>
                    <td>
                        <button class="edit-btn"
                            onclick="editService(${service.service_id})">
                            Edit
                        </button>

                        <button class="delete-btn"
                            onclick="deleteService(${service.service_id})">
                            Delete
                        </button>
                    </td>
                `;

                serviceTable.appendChild(row);
            });

        } catch (error) {
            alert(error.message);
        }
    }

    // Escape HTML text
    function escapeServiceHTML(value) {
        return String(value ?? '').replace(/[&<>"']/g, character => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[character]);
    }

    // Add or update service
    serviceForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const id = document.getElementById('service_id').value;

        const service = {
            service_name: document.getElementById('service_name').value.trim(),
            price_per_kg: document.getElementById('price_per_kg').value,
            description: document.getElementById('description').value.trim()
        };

        const url = id
            ? `/api/services/${id}`
            : '/api/services';

        const method = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(service)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Request failed');
            }

            alert(result.message || 'Service saved successfully');

            resetServiceForm();
            loadServices();

        } catch (error) {
            alert('Error: ' + error.message);
        }
    });

    // Edit service
    window.editService = async function(id) {
        try {
            const response = await fetch('/api/services');
            const services = await response.json();

            const service = services.find(
                item => Number(item.service_id) === Number(id)
            );

            if (!service) {
                alert('Service not found');
                return;
            }

            document.getElementById('service_id').value = service.service_id;
            document.getElementById('service_name').value = service.service_name;
            document.getElementById('price_per_kg').value = service.price_per_kg;
            document.getElementById('description').value = service.description || '';

            document.getElementById('serviceSubmitBtn').textContent = 'Update Service';
            document.getElementById('serviceCancelBtn').style.display = 'inline-block';

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        } catch (error) {
            alert(error.message);
        }
    };

    // Delete service
    window.deleteService = async function(id) {
        if (!confirm('Are you sure you want to delete this service?')) {
            return;
        }

        try {
            const response = await fetch(`/api/services/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Delete failed');
            }

            alert(result.message || 'Service deleted successfully');
            loadServices();

        } catch (error) {
            alert('Delete failed: ' + error.message);
        }
    };

    // Reset service form
    window.resetServiceForm = function() {
        serviceForm.reset();

        document.getElementById('service_id').value = '';

        document.getElementById('serviceSubmitBtn').textContent = 'Add Service';

        document.getElementById('serviceCancelBtn').style.display = 'none';
    };

    // Load services when page opens
    loadServices();
}
// ORDERS CRUD OPERATIONS

const orderForm = document.getElementById('orderForm');

if (orderForm) {

    const orderTable = document.getElementById('orderTable');

    // Load customers into dropdown
    async function loadCustomerDropdown() {
        const response = await fetch('/api/customers');
        const customers = await response.json();

        const dropdown = document.getElementById('customer_id');
        dropdown.innerHTML = '<option value="">Select Customer</option>';

        customers.forEach(customer => {
            dropdown.innerHTML += `
                <option value="${customer.customer_id}">
                    ${customer.name}
                </option>
            `;
        });
    }

    // Load services into dropdown
    async function loadServiceDropdown() {
        const response = await fetch('/api/services');
        const services = await response.json();

        const dropdown = document.getElementById('service_id');
        dropdown.innerHTML = '<option value="">Select Service</option>';

        services.forEach(service => {
            dropdown.innerHTML += `
                <option value="${service.service_id}">
                    ${service.service_name}
                </option>
            `;
        });
    }

    // Load all orders
    async function loadOrders() {
        try {
            const response = await fetch('/api/orders');

            if (!response.ok) {
                throw new Error('Unable to load orders');
            }

            const orders = await response.json();
            orderTable.innerHTML = '';

            orders.forEach(order => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${order.order_id}</td>
                    <td>${escapeOrderHTML(order.customer_name || '')}</td>
                    <td>${escapeOrderHTML(order.service_name || '')}</td>
                    <td>${formatOrderDate(order.order_date)}</td>
                    <td>${formatOrderDate(order.delivery_date)}</td>
                    <td>₹${Number(order.total_amount).toFixed(2)}</td>
                    <td>${escapeOrderHTML(order.status)}</td>
                    <td>
                        <button class="edit-btn"
                            onclick="editOrder(${order.order_id})">
                            Edit
                        </button>

                        <button class="delete-btn"
                            onclick="deleteOrder(${order.order_id})">
                            Delete
                        </button>
                    </td>
                `;

                orderTable.appendChild(row);
            });

        } catch (error) {
            alert('Error loading orders: ' + error.message);
        }
    }

    // Escape HTML
    function escapeOrderHTML(value) {
        return String(value ?? '').replace(/[&<>"']/g, character => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[character]);
    }

    // Format date
    function formatOrderDate(value) {
        if (!value) return '';

        const date = new Date(value);
        return date.toLocaleDateString('en-GB');
    }

    // Add or update order
    orderForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const id = document.getElementById('order_id').value;

        const order = {
            customer_id: Number(document.getElementById('customer_id').value),
            service_id: Number(document.getElementById('service_id').value),
            order_date: document.getElementById('order_date').value,
            delivery_date: document.getElementById('delivery_date').value,
            total_amount: document.getElementById('total_amount').value,
            status: document.getElementById('status').value
        };

        const url = id
            ? `/api/orders/${id}`
            : '/api/orders';

        const method = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Request failed');
            }

            alert(result.message || 'Order saved successfully');

            resetOrderForm();
            loadOrders();

        } catch (error) {
            alert('Error: ' + error.message);
        }
    });

    // Edit order
    window.editOrder = async function(id) {
        try {
            const response = await fetch('/api/orders');
            const orders = await response.json();

            const order = orders.find(
                item => Number(item.order_id) === Number(id)
            );

            if (!order) {
                alert('Order not found');
                return;
            }

            document.getElementById('order_id').value = order.order_id;
            document.getElementById('customer_id').value = order.customer_id;
            document.getElementById('service_id').value = order.service_id;
            document.getElementById('order_date').value =
                formatInputDate(order.order_date);
            document.getElementById('delivery_date').value =
                formatInputDate(order.delivery_date);
            document.getElementById('total_amount').value = order.total_amount;
            document.getElementById('status').value = order.status;

            document.getElementById('orderSubmitBtn').textContent = 'Update Order';
            document.getElementById('orderCancelBtn').style.display = 'inline-block';

            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            alert('Error editing order: ' + error.message);
        }
    };

    // Convert date into YYYY-MM-DD for date input
    function formatInputDate(value) {
        if (!value) return '';

        const date = new Date(value);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    // Delete order
    window.deleteOrder = async function(id) {
        if (!confirm('Are you sure you want to delete this order?')) {
            return;
        }

        try {
            const response = await fetch(`/api/orders/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Delete failed');
            }

            alert(result.message || 'Order deleted successfully');
            loadOrders();

        } catch (error) {
            alert('Delete failed: ' + error.message);
        }
    };

    // Reset form
    window.resetOrderForm = function() {
        orderForm.reset();

        document.getElementById('order_id').value = '';

        document.getElementById('orderSubmitBtn').textContent = 'Add Order';

        document.getElementById('orderCancelBtn').style.display = 'none';
    };

    // Initial loading
    async function initializeOrdersPage() {
        try {
            await loadCustomerDropdown();
            await loadServiceDropdown();
            await loadOrders();
        } catch (error) {
            alert('Unable to initialize Orders page: ' + error.message);
        }
    }

    initializeOrdersPage();
}
// PAYMENTS CRUD OPERATIONS

const paymentForm = document.getElementById('paymentForm');

if (paymentForm) {

    const paymentTable = document.getElementById('paymentTable');

    // Load orders into dropdown
    async function loadOrderDropdown() {
        const response = await fetch('/api/orders');

        if (!response.ok) {
            throw new Error('Unable to load orders');
        }

        const orders = await response.json();

        const dropdown = document.getElementById('order_id');

        dropdown.innerHTML = '<option value="">Select Order</option>';

        orders.forEach(order => {
            dropdown.innerHTML += `
                <option value="${order.order_id}">
                    Order #${order.order_id} - ${order.customer_name || 'Customer'}
                </option>
            `;
        });
    }

    // Load all payments
    async function loadPayments() {
        try {
            const response = await fetch('/api/payments');

            if (!response.ok) {
                throw new Error('Unable to load payments');
            }

            const payments = await response.json();

            paymentTable.innerHTML = '';

            payments.forEach(payment => {

                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${payment.payment_id}</td>
                    <td>${payment.order_id}</td>
                    <td>₹${Number(payment.amount).toFixed(2)}</td>
                    <td>${formatPaymentDate(payment.payment_date)}</td>
                    <td>${escapePaymentHTML(payment.payment_method || '')}</td>
                    <td>${escapePaymentHTML(payment.status)}</td>

                    <td>
                        <button class="edit-btn"
                            onclick="editPayment(${payment.payment_id})">
                            Edit
                        </button>

                        <button class="delete-btn"
                            onclick="deletePayment(${payment.payment_id})">
                            Delete
                        </button>
                    </td>
                `;

                paymentTable.appendChild(row);
            });

        } catch (error) {
            alert('Error loading payments: ' + error.message);
        }
    }

    // Escape HTML
    function escapePaymentHTML(value) {
        return String(value ?? '').replace(/[&<>"']/g, character => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[character]);
    }

    // Format date for table
    function formatPaymentDate(value) {
        if (!value) return '';

        const date = new Date(value);

        return date.toLocaleDateString('en-GB');
    }

    // Format date for input
    function formatPaymentInputDate(value) {
        if (!value) return '';

        const date = new Date(value);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    // Add or update payment
    paymentForm.addEventListener('submit', async function(event) {

        event.preventDefault();

        const id = document.getElementById('payment_id').value;

        const payment = {
            order_id: Number(document.getElementById('order_id').value),
            amount: document.getElementById('amount').value,
            payment_date: document.getElementById('payment_date').value,
            payment_method: document.getElementById('payment_method').value,
            status: document.getElementById('payment_status').value
        };

        const url = id
            ? `/api/payments/${id}`
            : '/api/payments';

        const method = id ? 'PUT' : 'POST';

        try {

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payment)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Request failed');
            }

            alert(result.message || 'Payment saved successfully');

            resetPaymentForm();

            loadPayments();

        } catch (error) {
            alert('Error: ' + error.message);
        }
    });

    // Edit payment
    window.editPayment = async function(id) {

        try {

            const response = await fetch('/api/payments');

            const payments = await response.json();

            const payment = payments.find(
                item => Number(item.payment_id) === Number(id)
            );

            if (!payment) {
                alert('Payment not found');
                return;
            }

            document.getElementById('payment_id').value = payment.payment_id;

            document.getElementById('order_id').value = payment.order_id;

            document.getElementById('amount').value = payment.amount;

            document.getElementById('payment_date').value =
                formatPaymentInputDate(payment.payment_date);

            document.getElementById('payment_method').value =
                payment.payment_method || '';

            document.getElementById('payment_status').value =
                payment.status;

            document.getElementById('paymentSubmitBtn').textContent =
                'Update Payment';

            document.getElementById('paymentCancelBtn').style.display =
                'inline-block';

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        } catch (error) {
            alert('Error editing payment: ' + error.message);
        }
    };

    // Delete payment
    window.deletePayment = async function(id) {

        if (!confirm('Are you sure you want to delete this payment?')) {
            return;
        }

        try {

            const response = await fetch(`/api/payments/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Delete failed');
            }

            alert(result.message || 'Payment deleted successfully');

            loadPayments();

        } catch (error) {
            alert('Delete failed: ' + error.message);
        }
    };

    // Reset payment form
    window.resetPaymentForm = function() {

        paymentForm.reset();

        document.getElementById('payment_id').value = '';

        document.getElementById('paymentSubmitBtn').textContent =
            'Add Payment';

        document.getElementById('paymentCancelBtn').style.display =
            'none';
    };

    // Initialize payments page
    async function initializePaymentsPage() {

        try {

            await loadOrderDropdown();

            await loadPayments();

        } catch (error) {

            alert('Unable to initialize Payments page: ' + error.message);
        }
    }

    initializePaymentsPage();
}