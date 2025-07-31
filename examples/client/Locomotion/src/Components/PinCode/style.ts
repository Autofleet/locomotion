import { StyleSheet } from 'react-native';

interface StylingProps {
    theme: any;
};

export const styling = ({ theme }: StylingProps) => StyleSheet.create({
    root: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    codeFieldRoot: {
        marginTop: 20,
        width: 280,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    cellContainer: {
        borderBottomWidth: 2,
        borderColor: '#333333',
    },
    focusCell: {
        borderColor: theme.primaryColor,
    },
    errorCell: {
        borderColor: theme.errorColor,
    },
    cell: {
        width: 55,
        height: 55,
        lineHeight: 55,
        fontSize: 30,
        fontWeight: '600',
        textAlign: 'center',
        color: theme.textColor,
    }
});
