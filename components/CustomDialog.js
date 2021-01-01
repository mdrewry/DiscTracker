import * as React from "react";
import { Paragraph, Dialog, Portal } from "react-native-paper";

export default function CustomDialog({
  visible,
  setVisible,
  children,
  prompt,
  type,
}) {
  const hideDialog = () => setVisible(false);
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>{type}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{prompt}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>{children}</Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
