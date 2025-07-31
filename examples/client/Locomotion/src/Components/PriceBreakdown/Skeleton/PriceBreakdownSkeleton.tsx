import { Skeleton } from "../../Skeleton/Skeleton";
import { StyleSheet, View } from "react-native"

export const PriceBreakdownSkeleton = () => (
    <Skeleton>
        <View style={styles.content} />
    </Skeleton>
)

const styles = StyleSheet.create({
    content: {
        width: 50,
        height: 10,
    }
})