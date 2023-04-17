import {
  List,
  ListItem,
  Container,
  Avatar,
  Box,
  Text,
  Flex,
  Button,
  AlertDialog,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogFooter,
  Skeleton,
  IconButton,
} from "@chakra-ui/react";
import { EditIcon, ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { useEffect, useState, useRef, useCallback } from "react";
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
  const cancelRef = useRef<any>();
  const itemsPerPage = 8;
  const cardWidth = 450;

  const lastPage = Math.ceil(props.usersQuantity / itemsPerPage);

  const getCurrentUsers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return userArray.slice(startIndex, endIndex);
  };

  const handleModal = useCallback(
    (index: number) => {
      setState((prevState) => ({
        ...prevState,
        selectedUser: userArray[index],
      }));
      setShowUserModal(true);
    },
    [userArray]
  );

  const handleNextPage = useCallback(() => {
    setCurrentPage(currentPage + 1);
  }, [currentPage, setCurrentPage]);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage(currentPage - 1);
  }, [currentPage, setCurrentPage]);

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

  if (state.message !== "" && state.showAlert) {
    return (
      <AlertDialog
        isCentered
        isOpen={state.showAlert}
        leastDestructiveRef={cancelRef}
        onClose={() => {}}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Error
            </AlertDialogHeader>
            <AlertDialogBody>{state.message}</AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => {
                  setState((prevState) => ({ ...prevState, showAlert: false }));
                }}
              >
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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
