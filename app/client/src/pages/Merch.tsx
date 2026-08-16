import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingBag, Plus, CheckCircle2, Clock, Package, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const AVAILABLE_MERCH = [
  { id: "1", name: "Anom Artsy T-Shirt", price: 24.99, image: "👕", category: "clothing" },
  { id: "2", name: "Neon Hoodie", price: 49.99, image: "🧥", category: "clothing" },
  { id: "3", name: "Anom Artsy Mug", price: 14.99, image: "☕", category: "accessories" },
  { id: "4", name: "Sticker Pack", price: 9.99, image: "🏷️", category: "accessories" },
  { id: "5", name: "Beanie", price: 29.99, image: "🧢", category: "clothing" },
  { id: "6", name: "Water Bottle", price: 19.99, image: "🧴", category: "accessories" },
];

export default function Merch() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"shop" | "requests" | "orders" | "cart">("shop");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    email: user?.email || "",
    address: "",
    paymentMethod: "stripe",
  });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    design: "",
  });

  // tRPC mutations and queries
  const submitDesignMutation = trpc.merch.createRequest.useMutation();
  const { data: orders = [] } = trpc.merch.getMyOrders.useQuery(undefined, { enabled: !!user });
  const { data: designs = [] } = trpc.merch.getMyRequests.useQuery(undefined, { enabled: !!user });

  if (loading) {
    return <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-[#ff00cc]">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <Card className="border-2 border-[#ff00cc] bg-[#0b0e14]/80 p-8">
          <p className="text-[#ff00cc] mb-4">Please sign in to access the merch shop</p>
          <Button onClick={() => navigate("/")} className="bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black">
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  const addToCart = (item: typeof AVAILABLE_MERCH[0]) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { id: item.id, name: item.name, price: item.price, quantity: 1, image: item.image }]);
    }
    toast.success(`${item.name} added to cart!`);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(c => c.id === id ? { ...c, quantity } : c));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!checkoutData.address) {
      toast.error("Please enter a shipping address");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      // For now, show a success message and clear cart
      // In production, this would integrate with Stripe
      toast.success("Order placed! You will receive a confirmation email.");
      setCart([]);
      setIsCheckoutOpen(false);
    } catch (error) {
      toast.error("Failed to process checkout");
      console.error(error);
    }
  };

  const handleSubmitDesign = async () => {
    if (!formData.title || !formData.description) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await submitDesignMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        referenceImages: formData.design ? [formData.design] : undefined,
      });
      toast.success("Design submitted successfully!");
      setFormData({ title: "", description: "", design: "" });
      setIsRequestOpen(false);
    } catch (error) {
      toast.error("Failed to submit design");
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400";
      case "approved":
        return "text-blue-400";
      case "in_production":
        return "text-purple-400";
      case "shipped":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "approved":
        return "✅";
      case "in_production":
        return "🔧";
      case "shipped":
        return "📦";
      default:
        return "❓";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0e14] to-[#1a1f2e] p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-[#ff00cc] flex items-center gap-3">
            <ShoppingBag className="w-10 h-10" />
            Anom Artsy Merch
          </h1>
          <Button variant="outline" onClick={() => navigate("/")} className="text-[#00eaff] border-[#00eaff] hover:bg-[#00eaff]/10 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
        <p className="text-gray-400">Custom designs, white-glove service, social good impact</p>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-8 flex gap-2 flex-wrap">
        {[
          { id: "shop", label: "Shop", icon: "🛍️" },
          { id: "cart", label: `Cart (${cart.length})`, icon: "🛒" },
          { id: "requests", label: "My Requests", icon: "📝" },
          { id: "orders", label: "My Orders", icon: "📦" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg border-2 font-bold transition-all ${
              activeTab === tab.id
                ? "border-[#ff00cc] bg-[#ff00cc]/20 text-[#ff00cc]"
                : "border-[#00eaff] bg-transparent text-[#00eaff] hover:bg-[#00eaff]/10"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Shop Tab */}
      {activeTab === "shop" && (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AVAILABLE_MERCH.map((item) => (
              <Card key={item.id} className="border-2 border-[#ff00cc] bg-[#0b0e14]/80 p-6 hover:border-[#00eaff] transition-all">
                <div className="text-6xl mb-4">{item.image}</div>
                <h3 className="text-xl font-bold text-[#ff00cc] mb-2">{item.name}</h3>
                <p className="text-2xl font-bold text-[#00eaff] mb-4">${item.price}</p>
                <Button onClick={() => addToCart(item)} className="w-full bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold">
                  Add to Cart
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Cart Tab */}
      {activeTab === "cart" && (
        <div className="max-w-4xl mx-auto">
          {cart.length === 0 ? (
            <Card className="border-2 border-[#00eaff] bg-[#0b0e14]/80 p-8 text-center">
              <ShoppingCart className="w-16 h-16 text-[#00eaff] mx-auto mb-4 opacity-50" />
              <p className="text-[#00eaff] text-lg">Your cart is empty</p>
            </Card>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {cart.map((item) => (
                  <Card key={item.id} className="border-2 border-[#ff00cc] bg-[#0b0e14]/80 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{item.image}</div>
                        <div>
                          <p className="font-bold text-[#ff00cc]">{item.name}</p>
                          <p className="text-[#00eaff]">${item.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 bg-[#ff00cc]/20 text-[#ff00cc] rounded">-</button>
                          <span className="text-white font-bold w-8 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 bg-[#ff00cc]/20 text-[#ff00cc] rounded">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Checkout */}
              <Card className="border-2 border-[#00eaff] bg-[#0b0e14]/80 p-6">
                <div className="mb-6">
                  <p className="text-[#00eaff] text-lg font-bold mb-2">Order Summary</p>
                  <div className="space-y-2 text-gray-300">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.name} x{item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#00eaff]/20 mt-4 pt-4 flex justify-between text-xl font-bold text-[#ff00cc]">
                    <span>Total:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-[#00eaff] hover:bg-[#00eaff]/80 text-black font-bold py-3 text-lg">
                      Proceed to Checkout
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#0b0e14] border-2 border-[#ff00cc]">
                    <DialogHeader>
                      <DialogTitle className="text-[#ff00cc]">Checkout</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Email</label>
                        <Input value={checkoutData.email} onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })} className="bg-[#1a1f2e] border-[#ff00cc] text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Shipping Address</label>
                        <Textarea value={checkoutData.address} onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })} placeholder="Street, City, State, ZIP" className="bg-[#1a1f2e] border-[#ff00cc] text-white" />
                      </div>
                      <div className="bg-[#1a1f2e] p-4 rounded border border-[#00eaff]/20">
                        <p className="text-[#00eaff] font-bold mb-2">Total: ${cartTotal.toFixed(2)}</p>
                        <p className="text-sm text-gray-400">You will be redirected to Stripe for secure payment</p>
                      </div>
                      <Button 
                        onClick={handleCheckout}
                        className="w-full bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold py-3"
                      >
                        Complete Order
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === "requests" && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Submit Custom Design
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0b0e14] border-2 border-[#ff00cc]">
                <DialogHeader>
                  <DialogTitle className="text-[#ff00cc]">Submit Custom Merch Design</DialogTitle>
                  <DialogDescription className="text-gray-400">Tell us your idea and we'll create it for you</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Design Title</label>
                    <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Neon Dragon T-Shirt" className="bg-[#1a1f2e] border-[#ff00cc] text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                    <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe your design idea..." className="bg-[#1a1f2e] border-[#ff00cc] text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Design Details</label>
                    <Textarea value={formData.design} onChange={(e) => setFormData({ ...formData, design: e.target.value })} placeholder="Colors, style, placement, etc..." className="bg-[#1a1f2e] border-[#ff00cc] text-white" />
                  </div>
                  <Button 
                    onClick={handleSubmitDesign}
                    disabled={submitDesignMutation.isPending}
                    className="w-full bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold"
                  >
                    {submitDesignMutation.isPending ? "Submitting..." : "Submit Design"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {designs.length === 0 ? (
            <Card className="border-2 border-[#00eaff] bg-[#0b0e14]/80 p-6 text-center">
              <p className="text-[#00eaff]">No custom design requests yet</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {designs.map((design: any) => (
                <Card key={design.id} className="border-2 border-[#ff00cc] bg-[#0b0e14]/80 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[#ff00cc] mb-2">{design.title}</h3>
                      <p className="text-[#00eaff] mb-2">{design.description}</p>
                      <p className="text-gray-400 text-sm mb-4">{design.design}</p>
                      <p className={`text-sm font-bold ${getStatusColor(design.status)}`}>
                        {getStatusIcon(design.status)} {design.status.replace("_", " ").toUpperCase()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="max-w-4xl mx-auto">
          {orders.length === 0 ? (
            <Card className="border-2 border-[#00eaff] bg-[#0b0e14]/80 p-6 text-center">
              <p className="text-[#00eaff]">No orders yet</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <Card key={order.id} className="border-2 border-[#ff00cc] bg-[#0b0e14]/80 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[#ff00cc] mb-2">Order #{order.id.slice(0, 8)}</h3>
                      <p className="text-[#00eaff] mb-2">${(order.total / 100).toFixed(2)}</p>
                      <p className="text-gray-400 text-sm mb-2">Items: {order.items}</p>
                      <p className="text-gray-400 text-sm mb-4">Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p className={`text-sm font-bold ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {order.status.replace("_", " ").toUpperCase()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
