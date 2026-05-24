import { FlatList, FlatListProps } from "react-native";
import HistoryItem from "./components/HistoryItem";
import { forwardRef } from "react";
import Animated from "react-native-reanimated";

const historyData = [
  {
    id: '1',
    title: 'Swiggy',
    subtitle: 'Food Order',
    amount: -450,
    formattedAmount: '-₹450',
    displayDate: 'Today',
    status: 'completed',
    icon: '🍔',
  },
  {
    id: '2',
    title: 'Uber',
    subtitle: 'Ride',
    amount: -320,
    formattedAmount: '-₹320',
    displayDate: 'Today',
    status: 'completed',
    icon: '🚕',
  },
  {
    id: '3',
    title: 'Salary',
    subtitle: 'Company Credit',
    amount: 50000,
    formattedAmount: '+₹50,000',
    displayDate: 'Yesterday',
    status: 'completed',
    icon: '💰',
  },
  {
    id: '4',
    title: 'Amazon',
    subtitle: 'Shopping',
    amount: -2300,
    formattedAmount: '-₹2,300',
    displayDate: 'Yesterday',
    status: 'completed',
    icon: '📦',
  },
  {
    id: '5',
    title: 'Zomato',
    subtitle: 'Food Order',
    amount: -780,
    formattedAmount: '-₹780',
    displayDate: 'Yesterday',
    status: 'pending',
    icon: '🍕',
  },
  {
    id: '6',
    title: 'Electricity Bill',
    subtitle: 'Utilities',
    amount: -1500,
    formattedAmount: '-₹1,500',
    displayDate: 'Mar 18',
    status: 'completed',
    icon: '💡',
  },
  {
    id: '7',
    title: 'Netflix',
    subtitle: 'Subscription',
    amount: -499,
    formattedAmount: '-₹499',
    displayDate: 'Mar 18',
    status: 'completed',
    icon: '🎬',
  },
  {
    id: '8',
    title: 'Petrol Pump',
    subtitle: 'Fuel',
    amount: -2000,
    formattedAmount: '-₹2,000',
    displayDate: 'Mar 17',
    status: 'completed',
    icon: '⛽',
  },
  {
    id: '9',
    title: 'Flipkart',
    subtitle: 'Shopping',
    amount: -1200,
    formattedAmount: '-₹1,200',
    displayDate: 'Mar 17',
    status: 'completed',
    icon: '🛒',
  },
  {
    id: '10',
    title: 'Freelance Payment',
    subtitle: 'Client Transfer',
    amount: 12000,
    formattedAmount: '+₹12,000',
    displayDate: 'Mar 16',
    status: 'completed',
    icon: '💻',
  },
  {
    id: '11',
    title: 'BigBasket',
    subtitle: 'Groceries',
    amount: -950,
    formattedAmount: '-₹950',
    displayDate: 'Mar 16',
    status: 'completed',
    icon: '🥦',
  },
  {
    id: '12',
    title: 'Phone Recharge',
    subtitle: 'Mobile',
    amount: -299,
    formattedAmount: '-₹299',
    displayDate: 'Mar 15',
    status: 'completed',
    icon: '📱',
  },
  {
    id: '13',
    title: 'Gym',
    subtitle: 'Membership',
    amount: -1800,
    formattedAmount: '-₹1,800',
    displayDate: 'Mar 15',
    status: 'completed',
    icon: '🏋️',
  },
  {
    id: '14',
    title: 'Interest Credit',
    subtitle: 'Savings Account',
    amount: 320,
    formattedAmount: '+₹320',
    displayDate: 'Mar 14',
    status: 'completed',
    icon: '🏦',
  },
  {
    id: '15',
    title: 'BookMyShow',
    subtitle: 'Movie Tickets',
    amount: -600,
    formattedAmount: '-₹600',
    displayDate: 'Mar 14',
    status: 'completed',
    icon: '🎟️',
  },
];

type Props = Omit<FlatListProps<typeof historyData[number]>, 'renderItem' | 'data' | 'CellRendererComponent'>;
const HistoryTab = forwardRef<FlatList, Props>((props, ref) => {
  return (
    <Animated.FlatList
      ref={ref}
      data={historyData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <HistoryItem item={item} />
      )}
      {...props}
    />
  );
});

export default HistoryTab;