import { Sizes } from "@/constants/Sizes";
import Ionicons from "@expo/vector-icons/Ionicons";
import Button from "./Button";

interface GoBackButtonProps {
    onPress: () => void;
}

export default function GoBackButton({ onPress }: GoBackButtonProps) {
    return (
        <Button
            title={<Ionicons name="chevron-back" size={Sizes.buttonIcon} />}
            icon={true}
            onPress={onPress}
        />
    );
}
