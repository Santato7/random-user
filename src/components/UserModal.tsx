import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Avatar,
  Text,
  Box,
  Flex,
} from "@chakra-ui/react";
import { User } from "../interfaces";
import { PhoneIcon } from "@chakra-ui/icons";

interface Props {
  user: User | null;
  setShowUserModal: (value: boolean) => void;
}

export default function UserModal(props: Props) {
  const { user, setShowUserModal } = props;
  return (
    <>
      <Modal isOpen={true} onClose={() => setShowUserModal(false)} size={"2xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={"flex"} gap={5} alignItems={"center"}>
            <Avatar size={"xl"} src={user?.picture.large} />
            <Box>
              <Text fontSize={"3xl"}>
                {`${user?.name.title} ${user?.name.last}`}
              </Text>
              <Text color={"whiteAlpha.700"} fontSize={"md"}>
                {user?.email}
              </Text>
              <Flex alignItems={"center"} gap={2}>
                <PhoneIcon w={3} h={3} />
                <Text fontSize={"sm"}>
                  {user?.cell} -{" "}
                  {`${user?.location.country}, ${user?.location.postcode}`}
                </Text>
              </Flex>
            </Box>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
