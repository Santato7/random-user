import React, { useCallback, useState, useRef } from "react";
import UserList from "./components/UserList";
import {
  Button,
  CloseButton,
  Box,
  Input,
  Alert,
  AlertIcon,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
} from "@chakra-ui/react";

interface State {
  showAlert: boolean;
  count: number;
  value: number;
}

function App() {
  const [state, setState] = useState<State>({
    showAlert: false,
    count: 0,
    value: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const inputValueRef = useRef(0);
  const cardWidth = 450;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    inputValueRef.current = Number(event?.target.value);
  };

  const handleButtonClick = useCallback(() => {
    if (inputValueRef.current <= 0 || inputValueRef.current > 5000) {
      setState((prevState) => ({ ...prevState, showAlert: true }));
    } else {
      setState((prevState) => ({
        ...prevState,
        showAlert: false,
        count: state.count + 1,
        value: Math.floor(inputValueRef.current),
      }));
    }
  }, [inputValueRef, state]);

  const handleCloseAlert = () => {
    setState((prevState) => ({
      ...prevState,
      showAlert: false,
    }));
  };

  return (
    <Flex flexDirection={"column"} placeContent={"center"} height={"100vh"}>
      <Modal
        isCentered={true}
        isOpen={state.showAlert}
        onClose={handleCloseAlert}
        size={"lg"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bgColor={"#6b5c68"} gap={5} rounded={"sm"}>
            <Alert
              bgColor={"#6b5c68"}
              status="error"
              variant="subtle"
              display={"flex"}
              gap={1}
              justifyContent={"center"}
            >
              <AlertIcon marginBottom={1} />
              <Box marginBottom={2} paddingTop={1}>
                O número deve estar entre 0 e 5000.
              </Box>
              <CloseButton
                mb={1}
                color={"red.400"}
                onClick={handleCloseAlert}
              />
            </Alert>
          </ModalHeader>
        </ModalContent>
      </Modal>

      <Box
        display={"flex"}
        height={538}
        flexDirection={"column"}
        placeItems={"center"}
      >
        <Box
          display={"grid"}
          gridTemplateColumns={"1fr auto"}
          gap={1}
          padding={"0 1.5%"}
          maxWidth={cardWidth}
          marginBottom={5}
        >
          <Input
            type="number"
            bg={"blackAlpha.600"}
            onChange={handleChange}
            placeholder="Número de 1 a 5000"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleButtonClick();
              }
            }}
          />
          <Button
            isLoading={isLoading}
            loadingText={"Buscando..."}
            onClick={handleButtonClick}
          >
            Buscar Usuários
          </Button>
        </Box>
        {state.count > 0 && (
          <UserList
            key={state.count}
            usersQuantity={state.value}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
      </Box>
    </Flex>
  );
}

export default App;
