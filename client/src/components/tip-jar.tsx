import { useState, useEffect } from "react";
import { Coffee, Heart, DollarSign, CreditCard } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface TipJarProps {
  isOpen: boolean;
  onClose: () => void;
  story: {
    id: number;
    title: string;
  };
  author?: {
    id: number;
    username: string;
    avatar?: string;
  };
}

const PaymentForm = ({ amount, message, authorId, storyId, onSuccess }: {
  amount: number;
  message: string;
  authorId: number;
  storyId: number;
  onSuccess: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Tip Sent Successfully!",
        description: `Thank you for supporting this author with $${amount.toFixed(2)}!`,
      });
      onSuccess();
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || isSubmitting} className="w-full">
        <CreditCard className="mr-2 h-4 w-4" />
        {isSubmitting ? "Processing..." : `Send $${amount.toFixed(2)} Tip`}
      </Button>
    </form>
  );
};

export default function TipJar({ isOpen, onClose, story, author }: TipJarProps) {
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();

  const presetAmounts = [5, 10, 25, 50];

  const handleAmountSelect = (value: number) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setAmount(numValue);
    } else {
      setAmount(null);
    }
  };

  const handleSubmit = async () => {
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid tip amount",
        variant: "destructive"
      });
      return;
    }

    if (!author?.id) {
      toast({
        title: "Error",
        description: "Author information not available.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount: amount,
        storyId: story.id,
        authorId: author.id,
        message: message
      });
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
      setShowPayment(true);
    } catch (error) {
      toast({
        title: "Payment Setup Failed",
        description: "There was an error setting up the payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    setAmount(null);
    setCustomAmount("");
    setMessage("");
    setShowPayment(false);
    setClientSecret("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Coffee className="w-5 h-5 text-warning" />
            <span>Support the Author</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Author Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary text-white">
                    {author?.avatar || author?.username?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{author?.username}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Author of "{story.title}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amount Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Choose tip amount</label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset}
                  variant={amount === preset ? "default" : "outline"}
                  onClick={() => handleAmountSelect(preset)}
                  className="flex items-center space-x-2"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>{preset}</span>
                </Button>
              ))}
            </div>
            
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="number"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="pl-10"
                min="1"
                step="0.01"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Add a message (optional)
            </label>
            <Textarea
              placeholder="Thank you for this amazing story!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">
              {message.length}/200 characters
            </p>
          </div>

          {/* Payment Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Payment Details</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Tips are processed securely through Stripe. You can pay with any major credit card or digital wallet.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!amount || amount <= 0 || isProcessing}
              className="flex-1 bg-warning hover:bg-warning/90"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Send ${amount?.toFixed(2) || "0.00"}</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
