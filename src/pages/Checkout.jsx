import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Smartphone, Banknote, Lock, X, ChevronRight, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh',
  'Andaman & Nicobar Islands', 'Puducherry'
];

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Cart Slide, 2: Phone, 3: OTP, 4: Address, 5: Payment
  const [showCart, setShowCart] = useState(true);

  const [formData, setFormData] = useState({
    mobile: '',
    otp: '',
    fullName: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'upi',
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: ''
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const discountAmount = 650;
  const shippingAmount = cartTotal > 499 ? 0 : 49;
  const finalTotal = cartTotal - discountAmount + shippingAmount;

  const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSendOtp = () => {
    if (!formData.mobile.trim()) {
      setErrors({ mobile: 'Enter mobile number' });
      return;
    }
    if (!/^\d{10}$/.test(formData.mobile)) {
      setErrors({ mobile: 'Enter 10 digit mobile number' });
      return;
    }
    setOtpSent(true);
    setStep(3);
  };

  const handleVerifyOtp = () => {
    if (!formData.otp.trim()) {
      setErrors({ otp: 'Enter OTP' });
      return;
    }
    if (formData.otp.length !== 4) {
      setErrors({ otp: 'Enter 4 digit OTP' });
      return;
    }
    setStep(4);
  };

  const handleAddressContinue = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter valid email';
    if (!formData.address1.trim()) newErrors.address1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'Select a state';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Enter 6 digit pincode';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setStep(5);
  };

  const handlePaymentContinue = () => {
    const newErrors = {};
    if (formData.paymentMethod === 'upi' && !formData.upiId.trim()) {
      newErrors.upiId = 'Enter UPI ID';
    }
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Enter card number';
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Enter expiry';
      if (!formData.cardCvv.trim()) newErrors.cardCvv = 'Enter CVV';
      if (!formData.cardName.trim()) newErrors.cardName = 'Enter name on card';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setStep(5);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newOrderId = `SI${Date.now().toString().slice(-6)}`;
    setOrderId(newOrderId);
    setShowSuccess(true);
    clearCart();
    setIsProcessing(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  if (cartItems.length === 0 && !showSuccess) {
    return (
      <div className="checkout">
        <div className="checkout__empty">
          <h1 className="checkout__title">CHECKOUT</h1>
          <p>Your cart is empty</p>
          <Link to="/catalogue" className="checkout__empty-btn">START SHOPPING</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <h1 className="checkout__title">CHECKOUT</h1>

      {/* Step Indicator */}
      <div className="checkout__steps">
        <div className={`checkout__step ${step >= 1 ? 'active' : ''}`}>
          <span className="checkout__step-num">1</span>
          <span>Cart</span>
        </div>
        <div className="checkout__step-line" />
        <div className={`checkout__step ${step >= 2 ? 'active' : ''}`}>
          <span className="checkout__step-num">2</span>
          <span>Phone</span>
        </div>
        <div className="checkout__step-line" />
        <div className={`checkout__step ${step >= 4 ? 'active' : ''}`}>
          <span className="checkout__step-num">3</span>
          <span>Address</span>
        </div>
        <div className="checkout__step-line" />
        <div className={`checkout__step ${step >= 5 ? 'active' : ''}`}>
          <span className="checkout__step-num">4</span>
          <span>Payment</span>
        </div>
      </div>

      <div className="checkout__layout">
        <div className="checkout__form">
          {/* Step 1: Cart Slide-in Preview */}
          {step === 1 && showCart && (
            <section className="checkout__section checkout__cart-preview">
              <div className="checkout__cart-preview-header">
                <h2>CART ITEMS</h2>
                <button onClick={() => setShowCart(false)}>Edit</button>
              </div>
              <div className="checkout__cart-items">
                {cartItems.map(item => (
                  <div key={`${item.id}-${JSON.stringify(item.variants || {})}`} className="checkout__cart-item">
                    <img src={item.images?.[0] || 'https://via.placeholder.com/60'} alt={item.name} />
                    <div className="checkout__cart-item-info">
                      <span className="checkout__cart-item-name">{item.name}</span>
                      <span className="checkout__cart-item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="checkout__cart-item-price">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <button className="checkout__continue-btn" onClick={() => setStep(2)}>
                CONTINUE <ChevronRight size={18} />
              </button>
            </section>
          )}

          {/* Step 2: Phone Number */}
          {step === 2 && (
            <section className="checkout__section">
              <div className="checkout__step-header">
                <MessageCircle size={24} />
                <h2>VERIFY PHONE NUMBER</h2>
              </div>
              <p className="checkout__step-desc">We'll send you an OTP to verify your number</p>

              <div className="checkout__field">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter 10 digit mobile number"
                  maxLength={10}
                  className={errors.mobile ? 'error' : ''}
                />
                {errors.mobile && <span className="checkout__error">{errors.mobile}</span>}
              </div>

              <button className="checkout__continue-btn" onClick={handleSendOtp}>
                SEND OTP <ChevronRight size={18} />
              </button>
            </section>
          )}

          {/* Step 3: OTP Verification */}
          {step === 3 && (
            <section className="checkout__section">
              <div className="checkout__step-header">
                <MessageCircle size={24} />
                <h2>ENTER OTP</h2>
              </div>
              <p className="checkout__step-desc">OTP sent to +91 {formData.mobile}</p>

              <div className="checkout__field">
                <label>One Time Password *</label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter 4 digit OTP"
                  maxLength={4}
                  className={`checkout__otp-input ${errors.otp ? 'error' : ''}`}
                />
                {errors.otp && <span className="checkout__error">{errors.otp}</span>}
              </div>

              <p className="checkout__resend">Didn't receive OTP? <button onClick={handleSendOtp}>Resend</button></p>

              <button className="checkout__continue-btn" onClick={handleVerifyOtp}>
                VERIFY & CONTINUE <ChevronRight size={18} />
              </button>
            </section>
          )}

          {/* Step 4: Address */}
          {step === 4 && (
            <section className="checkout__section">
              <div className="checkout__step-header">
                <h2>DELIVERY ADDRESS</h2>
              </div>

              <div className="checkout__field">
                <label>Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter full name" className={errors.fullName ? 'error' : ''} />
                {errors.fullName && <span className="checkout__error">{errors.fullName}</span>}
              </div>

              <div className="checkout__field">
                <label>Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" className={errors.email ? 'error' : ''} />
                {errors.email && <span className="checkout__error">{errors.email}</span>}
              </div>

              <div className="checkout__field">
                <label>Address Line 1 *</label>
                <input type="text" name="address1" value={formData.address1} onChange={handleChange} placeholder="House No., Street, Area" className={errors.address1 ? 'error' : ''} />
                {errors.address1 && <span className="checkout__error">{errors.address1}</span>}
              </div>

              <div className="checkout__field">
                <label>Address Line 2</label>
                <input type="text" name="address2" value={formData.address2} onChange={handleChange} placeholder="Landmark (optional)" />
              </div>

              <div className="checkout__row">
                <div className="checkout__field">
                  <label>City *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className={errors.city ? 'error' : ''} />
                  {errors.city && <span className="checkout__error">{errors.city}</span>}
                </div>
                <div className="checkout__field">
                  <label>State *</label>
                  <select name="state" value={formData.state} onChange={handleChange} className={errors.state ? 'error' : ''}>
                    <option value="">Select</option>
                    {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <span className="checkout__error">{errors.state}</span>}
                </div>
                <div className="checkout__field">
                  <label>Pincode *</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" maxLength={6} className={errors.pincode ? 'error' : ''} />
                  {errors.pincode && <span className="checkout__error">{errors.pincode}</span>}
                </div>
              </div>

              <button className="checkout__continue-btn" onClick={handleAddressContinue}>
                CONTINUE TO PAYMENT <ChevronRight size={18} />
              </button>
            </section>
          )}

          {/* Step 5: Payment */}
          {step === 5 && (
            <section className="checkout__section">
              <div className="checkout__step-header">
                <h2>PAYMENT METHOD</h2>
              </div>

              <div className="checkout__payment-options">
                <div className={`checkout__payment-card ${formData.paymentMethod === 'upi' ? 'active' : ''}`} onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'upi' }))}>
                  <div className="checkout__payment-header">
                    <div className="checkout__payment-radio">{formData.paymentMethod === 'upi' && <div className="checkout__payment-radio-dot" />}</div>
                    <Smartphone size={20} /><span>UPI</span>
                  </div>
                  {formData.paymentMethod === 'upi' && (
                    <div className="checkout__payment-content">
                      <input type="text" name="upiId" value={formData.upiId} onChange={handleChange} placeholder="e.g. name@upi" className={errors.upiId ? 'error' : ''} />
                      {errors.upiId && <span className="checkout__error">{errors.upiId}</span>}
                    </div>
                  )}
                </div>

                <div className={`checkout__payment-card ${formData.paymentMethod === 'card' ? 'active' : ''}`} onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}>
                  <div className="checkout__payment-header">
                    <div className="checkout__payment-radio">{formData.paymentMethod === 'card' && <div className="checkout__payment-radio-dot" />}</div>
                    <CreditCard size={20} /><span>Credit / Debit Card</span>
                  </div>
                  {formData.paymentMethod === 'card' && (
                    <div className="checkout__payment-content">
                      <div className="checkout__field"><label>Card Number</label><input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456" maxLength={19} className={errors.cardNumber ? 'error' : ''} />{errors.cardNumber && <span className="checkout__error">{errors.cardNumber}</span>}</div>
                      <div className="checkout__row">
                        <div className="checkout__field"><label>Expiry</label><input type="text" name="cardExpiry" value={formData.cardExpiry} onChange={handleChange} placeholder="MM/YY" maxLength={5} className={errors.cardExpiry ? 'error' : ''} />{errors.cardExpiry && <span className="checkout__error">{errors.cardExpiry}</span>}</div>
                        <div className="checkout__field"><label>CVV</label><input type="password" name="cardCvv" value={formData.cardCvv} onChange={handleChange} placeholder="•••" maxLength={4} className={errors.cardCvv ? 'error' : ''} />{errors.cardCvv && <span className="checkout__error">{errors.cardCvv}</span>}</div>
                      </div>
                      <div className="checkout__field"><label>Name on Card</label><input type="text" name="cardName" value={formData.cardName} onChange={handleChange} placeholder="Name as on card" className={errors.cardName ? 'error' : ''} />{errors.cardName && <span className="checkout__error">{errors.cardName}</span>}</div>
                    </div>
                  )}
                </div>

                <div className={`checkout__payment-card ${formData.paymentMethod === 'cod' ? 'active' : ''}`} onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cod' }))}>
                  <div className="checkout__payment-header">
                    <div className="checkout__payment-radio">{formData.paymentMethod === 'cod' && <div className="checkout__payment-radio-dot" />}</div>
                    <Banknote size={20} /><span>Cash on Delivery</span>
                  </div>
                  {formData.paymentMethod === 'cod' && <p className="checkout__payment-note">Pay when your order arrives</p>}
                </div>
              </div>

              <button className="checkout__place-order-btn" onClick={handlePlaceOrder} disabled={isProcessing}>
                {isProcessing ? 'Placing Order...' : 'PLACE ORDER'}
              </button>
            </section>
          )}
        </div>

        {/* Order Summary */}
        <div className="checkout__summary">
          <h2 className="checkout__summary-title">ORDER SUMMARY</h2>

          <div className="checkout__summary-items">
            {cartItems.map(item => (
              <div key={`${item.id}-${JSON.stringify(item.variants || {})}`} className="checkout__summary-item">
                <img src={item.images?.[0] || 'https://via.placeholder.com/60'} alt={item.name} />
                <div className="checkout__summary-item-info">
                  <span className="checkout__summary-item-name">{item.name}</span>
                  <span className="checkout__summary-item-qty">Qty: {item.quantity}</span>
                </div>
                <span className="checkout__summary-item-price">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="checkout__summary-rows">
            <div className="checkout__summary-row"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
            <div className="checkout__summary-row checkout__summary-row--green"><span>Discount</span><span>- {formatPrice(discountAmount)}</span></div>
            <div className="checkout__summary-row checkout__summary-row--green"><span>Shipping</span><span>{shippingAmount === 0 ? 'FREE' : formatPrice(shippingAmount)}</span></div>
          </div>

          <div className="checkout__summary-divider" />
          <div className="checkout__summary-row checkout__summary-row--total"><span>Total</span><span className="checkout__summary-total-price">{formatPrice(finalTotal > 0 ? finalTotal : 0)}</span></div>

          <div className="checkout__summary-badges">
            <span><Lock size={14} /> Secure Payment</span>
            <span>✓ 100% Authentic</span>
            <span>↩ Easy Returns</span>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="checkout__modal-overlay">
          <div className="checkout__modal">
            <CheckCircle size={64} className="checkout__modal-icon" />
            <h2>Order Placed Successfully!</h2>
            <p>Your order has been placed. You will receive a confirmation shortly.</p>
            <p className="checkout__modal-orderid">Order ID: #{orderId}</p>
            <div className="checkout__modal-btns">
              <Link to="/catalogue" className="checkout__modal-btn checkout__modal-btn--primary">CONTINUE SHOPPING</Link>
              <Link to="/orders" className="checkout__modal-btn checkout__modal-btn--secondary">VIEW ORDERS</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}