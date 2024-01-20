import { Text } from "react-native";

export const formatNativeDate = (item: { endDate: string | number | Date; showTime: any; }, color: any) => {
    const dateInput = new Date(item.endDate);
    const showTime = item.showTime;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (isSameDay(dateInput, today) || isSameDay(dateInput, tomorrow)) {
        // Data uguale a oggi o domani
        return (
            <Text style={{ fontSize: 14, color: color }}>
                {showTime ? formatTime(dateInput) : formatDate(dateInput)}
            </Text>
        );
    } else if (isBefore(dateInput, today)) {
        // Data inferiore a oggi
        return (
            <Text style={{ fontSize: 14, color: '#fc4040' }}>
                {showTime ? formatFullDate(dateInput) : formatDate(dateInput)}
            </Text>
        );
    } else {
        // Altrimenti, usa il formato di default
        return (
            <Text style={{ fontSize: 14, color: color }}>
                {showTime ? formatFullDate(dateInput) : formatDate(dateInput)}
            </Text>
        );
    }
};

const isSameDay = (date1: Date, date2: Date) => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};

const isBefore = (date1: number | Date, date2: number | Date) => {
    return date1 < date2;
};

const formatTime = (date: Date) => {
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const formatFullDate = (date: Date) => {
    return date.toLocaleString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
};



export function parseDate(dateString: string) {
    const [hours, minutes] = dateString.slice(11, 16).split(':');
    return { hours: Number(hours), minutes: Number(minutes) };
}

export const formatDateForDisplay = (dateString: any) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
};