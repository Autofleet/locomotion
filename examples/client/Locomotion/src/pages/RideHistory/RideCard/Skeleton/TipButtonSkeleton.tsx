import { Skeleton } from "../../../../Components/Skeleton/Skeleton";
import { StyleSheet, View } from "react-native"

export const TipButtonSkeleton = () => (
    <Skeleton>
        <View style={styles.content} />
    </Skeleton>
)

const styles = StyleSheet.create({
    content: {
        width: 40,
        height: 10,
        marginTop: 10
    }
})