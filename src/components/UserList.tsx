import {
  List,
  ListItem,
  Container,
  Avatar,
  Box,
  Text,
  Flex,
  Button,
  CloseButton,
  Skeleton,
  IconButton,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { EditIcon, ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { useEffect, useState, useCallback } from "react";
import UserModal from "./UserModal";
import { User } from "../interfaces";

interface FetchJsonResponse {
  results: User[];
  error: string;
}

interface Props {
  usersQuantity: number;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

interface State {
  message: string;
  showAlert: boolean;
  selectedUser: User | null;
}

export default function UserList(props: Props) {
  const [state, setState] = useState<State>({
    message: "",
    showAlert: false,
    selectedUser: null,
  });
  const [showUserModal, setShowUserModal] = useState(false);
  const [userArray, setUserArray] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const cardWidth = 450;

  const lastPage = Math.ceil(props.usersQuantity / itemsPerPage);

  useEffect(() => {
    props.setIsLoading(true);
    fetch(
      `https://randomuser.me/api?results=${props.usersQuantity}&noinfo&exc=login,registered,nat,id,phone,gender,dob`
    )
      .then((response) => response.json())
      .then((response: FetchJsonResponse) => {
        response.results ? setUserArray(response.results) : setUserArray([]);

        if (response.error) {
          setState((prevState) => ({
            ...prevState,
            message: response.error,
            showAlert: true,
          }));
        }

        props.setIsLoading(false);
      });
  }, []);

  const getCurrentUsers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = userArray.slice(startIndex, endIndex);
    return currentUsers;
  };

  const handleModal = useCallback(
    (index: number) => {
      setState((prevState) => ({
        ...prevState,
        selectedUser: getCurrentUsers()[index],
      }));
      setShowUserModal(true);
    },
    [userArray, currentPage]
  );

  const handleNextPage = useCallback(() => {
    setCurrentPage(currentPage + 1);
  }, [currentPage, setCurrentPage]);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage(currentPage - 1);
  }, [currentPage, setCurrentPage]);

  const handleCloseAlert = () => {
    setState((prevState) => ({
      ...prevState,
      showAlert: false,
    }));
  };

  if (state.message !== "" && state.showAlert) {
    return (
      <Modal
        isCentered={true}
        isOpen={state.showAlert}
        onClose={handleCloseAlert}
        size={"xl"}
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
              <AlertIcon w={14} h={14} marginBottom={1} />
              <Box marginBottom={2} paddingTop={1}>
                {state.message}
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
    );
  }

  if (props.isLoading) {
    const skeletonArray = Array.from(Array(itemsPerPage));
    return (
      <>
        {skeletonArray.map((_, index) => (
          <Skeleton
            key={index}
            borderRadius={"5px"}
            margin={"0 auto"}
            height={"56px"}
            width={cardWidth}
            marginBottom={1}
          />
        ))}
      </>
    );
  }

  return (
    <>
      <Container maxWidth={cardWidth}>
        <List display={"flex"} flexDirection={"column"} gap={1}>
          {userArray !== undefined &&
            getCurrentUsers().map((user, index) => (
              <ListItem
                bg={"gray.600"}
                padding={"1"}
                borderRadius={"6"}
                key={index}
              >
                <Flex>
                  <Avatar src={user.picture.medium} />
                  <Box ml="3">
                    <Text fontWeight="bold">{`${user.name.title} ${user.name.first} ${user.name.last}`}</Text>
                    <Text fontSize="sm">{user.email}</Text>
                  </Box>
                  <IconButton
                    alignSelf={"center"}
                    ml={"auto"}
                    mr={1}
                    aria-label="Editar usuário"
                    variant={"outline"}
                    onClick={() => handleModal(index)}
                    icon={<EditIcon />}
                  />
                </Flex>
              </ListItem>
            ))}
        </List>
        {userArray.length > 0 && (
          <Box display="flex" gap={3} justifyContent="center" marginTop={2}>
            <Button isDisabled={currentPage === 1} onClick={handlePreviousPage}>
              <ArrowBackIcon />
            </Button>
            <Button
              isDisabled={currentPage === lastPage}
              onClick={handleNextPage}
            >
              <ArrowForwardIcon />
            </Button>
          </Box>
        )}
      </Container>

      {showUserModal && (
        <UserModal
          user={state.selectedUser}
          setShowUserModal={setShowUserModal}
        />
      )}
    </>
  );
}
