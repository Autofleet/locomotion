import { Skeleton } from "../../Skeleton/Skeleton";
import { StyleSheet, View } from "react-native";

const SkeletonItem = () => (
    <Skeleton>
        <View style={styles.container}>
            <View style={styles.itemText} />
            <View style={styles.itemButton} />
        </View>
    </Skeleton>
)

export const NoBreakdownSkeleton = () => {
    return (
        <>
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
    },
    itemText: {
        width: '30%',
        height: 10,
    },
    itemButton: {
        width: 50,
        height: 10,
    }
})