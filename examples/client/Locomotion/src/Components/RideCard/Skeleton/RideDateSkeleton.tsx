import { Skeleton } from "../../Skeleton/Skeleton";
import { StyleSheet, View } from "react-native";

export const RideDateSkeleton = () => (
    <Skeleton>
        <View style={styles.content} />
    </Skeleton>
);

const styles = StyleSheet.create({
    content: {
        width: 150,
        height: 17,
    },
});