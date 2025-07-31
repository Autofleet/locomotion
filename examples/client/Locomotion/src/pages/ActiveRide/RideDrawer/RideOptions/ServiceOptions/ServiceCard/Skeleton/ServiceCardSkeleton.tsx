

import { Skeleton } from "../../../../../../../Components/Skeleton/Skeleton"
import { StyleSheet, View } from "react-native"

export const ServiceCardSkeleton = () => (
    <Skeleton>
        <View style={styles.container}>
            <View style={styles.cardIcon} />
            <View style={styles.cardContentContainer}>
                <View style={firstRowStyle.container}>
                    <View style={firstRowStyle.firstItem} />
                    <View style={firstRowStyle.secondItem} />
                </View>
                <View style={secondRowStyle.container}>
                    <View style={secondRowStyle.firstItem} />
                    <View style={secondRowStyle.secondItem} />
                </View>
                <View style={thirdRowStyle.container} />
            </View>
        </View>
    </Skeleton>
)

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 30,
        alignItems: 'center',
    },
    cardIcon: {
        width: 40,
        height: 40,
    },
    cardContentContainer: {
        flexDirection: 'column',
        flexGrow: 1,
        paddingLeft: 20,
    },
})

const firstRowStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    firstItem: {
        width: '50%',
        height: 10,
    },
    secondItem: {
        width: '20%',
        height: 10,
    },
})

const secondRowStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '40%',
        marginBottom: 10,
    },
    firstItem: {
        width: '30%',
        height: 10,
    },
    secondItem: {
        width: '60%',
        height: 10,
    },
})

const thirdRowStyle = StyleSheet.create({
    container: {
        width: '45%',
        height: 10,
    },
})