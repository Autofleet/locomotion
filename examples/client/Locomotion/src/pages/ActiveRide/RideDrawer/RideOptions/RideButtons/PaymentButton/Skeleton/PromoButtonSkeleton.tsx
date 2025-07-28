import { Skeleton } from "../../../../../../../Components/Skeleton/Skeleton"
import { StyleSheet, View } from "react-native"

export const PromoButtonSkeleton = () => (
    <Skeleton>
        <View style={styles.content} />
    </Skeleton>
)

const styles = StyleSheet.create({
    content: {
        width: 40,
        height: 10
    }
})