import moment from "moment";
import { Text } from "react-native";

export const formatMomentData = (item: any) => {
    const dateInput = item.endDate;
    const showTime = item.showTime;

    const momentDate = moment(dateInput);

    const today = moment().startOf('day');
    const tomorrow = moment().startOf('day').add(1, 'day');

    if (momentDate.isSame(today, 'day') || momentDate.isSame(tomorrow, 'day')) {
        // Data uguale a oggi o domani
        return (
            <Text style={{ fontSize: 14 }}>
                {showTime ? momentDate.format('LT') : momentDate.calendar()}
            </Text>
        );
    } else if (momentDate.isBefore(today, 'day')) {
        // Data inferiore a oggi
        return (
            <Text style={{ fontSize: 14, color: '#fc4040' }}>
                {showTime ? momentDate.format('LLLL') : momentDate.format('LL')}
            </Text>
        );
    } else {
        // Altrimenti, usa il formato di default
        return (
            <Text style={{ fontSize: 14 }}>
                {showTime ? momentDate.format('LLLL') : momentDate.format('LL')}
            </Text>
        );
    }
};
