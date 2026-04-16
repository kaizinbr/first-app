// components/core/confirm-modal.tsx
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";

interface ConfirmModalProps {
    visible: boolean;
    title: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmDestructive?: boolean; // deixa o botão de confirmar vermelho
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    visible,
    title,
    message,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    confirmDestructive = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onCancel}
        >
            {/* Overlay escuro — toque fora fecha */}
            <Pressable style={styles.overlay} onPress={onCancel}>
                {/* Para o toque no card não fechar */}
                <Pressable
                    style={styles.card}
                    onPress={(e) => e.stopPropagation()}
                >
                    <Text style={styles.title}>{title}</Text>

                    {message && <Text style={styles.message}>{message}</Text>}

                    <View style={styles.actions}>
                        <Pressable
                            style={[styles.btn, styles.cancelBtn]}
                            onPress={onCancel}
                        >
                            <Text style={styles.cancelText}>{cancelLabel}</Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.btn,
                                styles.confirmBtn,
                                confirmDestructive && styles.destructiveBtn,
                            ]}
                            onPress={onConfirm}
                        >
                            <Text
                                style={[
                                    styles.confirmText,
                                    confirmDestructive &&
                                        styles.destructiveText,
                                ]}
                            >
                                {confirmLabel}
                            </Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    card: {
        width: "100%",
        backgroundColor: "#222",
        borderRadius: 16,
        padding: 24,
        gap: 12,
    },
    title: {
        color: "#eee",
        fontSize: 18,
        fontWeight: "bold",
    },
    message: {
        color: "#aaa",
        fontSize: 14,
        lineHeight: 20,
    },
    actions: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
    },
    btn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    cancelBtn: {
        backgroundColor: "#333",
    },
    cancelText: {
        color: "#eee",
        fontWeight: "600",
    },
    confirmBtn: {
        backgroundColor: "#8065ef",
    },
    confirmText: {
        color: "#fff",
        fontWeight: "600",
    },
    destructiveBtn: {
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        borderWidth: 1,
        borderColor: "#ef4444",
    },
    destructiveText: {
        color: "#ef4444",
    },
});
