import { MaterialIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import {
     Button,
     ButtonGroup,
     ButtonText,
     ButtonIcon,
     Center,
     FormControl,
     FormControlLabel,
     CircleIcon,
     FormControlLabelText,
     Heading,
     Icon,
     Input,
     InputField,
     Modal,
     ModalContent,
     ModalHeader,
     ModalBody,
     ModalFooter,
     Radio,
     RadioGroup,
     RadioLabel,
     RadioIndicator,
     RadioIcon,
     HStack,
     Textarea,
     TextareaInput,
     CloseIcon, ModalCloseButton, ModalBackdrop,
} from '@gluestack-ui/themed';
import React, { useState } from 'react';

import { popAlert } from '../../../components/loadError';
import { LanguageContext, LibrarySystemContext, ThemeContext, UserContext } from '../../../context/initialContext';
import { getTermFromDictionary } from '../../../translations/TranslationService';
import { createList } from '../../../util/api/list';

const CreateList = (props) => {
     const { setLoading } = props;
     const queryClient = useQueryClient();
     const { user, updateUser } = React.useContext(UserContext);
     const { library } = React.useContext(LibrarySystemContext);
     const { language } = React.useContext(LanguageContext);
     const { updateLists } = React.useContext(UserContext);
     const { textColor, theme, colorMode } = React.useContext(ThemeContext);
     const [loading, setAdding] = React.useState(false);
     const [showModal, setShowModal] = useState(false);

     const [title, setTitle] = React.useState('');
     const [description, setDescription] = React.useState('');
     const [isPublic, setPublic] = React.useState(false);

     const toggle = () => {
          setShowModal(!showModal);
          setTitle('');
          setDescription('');
          setPublic(false);
          setAdding(false);
     };

     return (
          <Center>
               <Button onPress={toggle} size="sm" bgColor={theme['colors']['primary']['500']}>
                    <ButtonIcon color={theme['colors']['primary']['500-text']} as={MaterialIcons} name="add" mr="$1" />
                    <ButtonText color={theme['colors']['primary']['500-text']}>{getTermFromDictionary(language, 'create_new_list')}</ButtonText>
               </Button>
               <Modal isOpen={showModal} onClose={toggle} size="full" avoidKeyboard>
                    <ModalBackdrop />
                    <ModalContent maxWidth="90%"  bgColor={colorMode === 'light' ? theme['colors']['warmGray']['50'] : theme['colors']['coolGray']['700']}>
                         <ModalHeader>
                              <Heading size="md" color={textColor}>{getTermFromDictionary(language, 'create_new_list')}</Heading>
                              <ModalCloseButton hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}>
                                   <Icon as={CloseIcon} color={textColor} />
                              </ModalCloseButton>
                         </ModalHeader>
                         <ModalBody>
                              <FormControl pb="$5">
                                   <FormControlLabel>
                                        <FormControlLabelText color={textColor}>{getTermFromDictionary(language, 'title')}</FormControlLabelText>
                                   </FormControlLabel>
                                   <Input>
                                        <InputField id="title" onChangeText={(text) => setTitle(text)} returnKeyType="next" defaultValue={title} color={textColor}/>
                                   </Input>
                              </FormControl>
                              <FormControl pb="$5">
                                   <FormControlLabel>
                                        <FormControlLabelText color={textColor}>{getTermFromDictionary(language, 'description')}</FormControlLabelText>
                                   </FormControlLabel>
                                   <Textarea id="description" onChangeText={(text) => setDescription(text)} defaultValue={description} returnKeyType="next"><TextareaInput color={textColor}/></Textarea>
                              </FormControl>
                              <FormControl>
                                   <FormControlLabel>
                                        <FormControlLabelText color={textColor}>{getTermFromDictionary(language, 'access')}</FormControlLabelText>
                                   </FormControlLabel>
                                   <RadioGroup
                                        name="access"
                                        value={isPublic}
                                        onChange={(nextValue) => {
                                             setPublic(nextValue);
                                        }}>
                                        <HStack direction="row" alignItems="center" space="md" w="75%" maxW="300px">
                                             <Radio value={false} my="$1">
                                                  <RadioIndicator mr="$2">
                                                       <RadioIcon as={CircleIcon} strokeWidth={1} />
                                                  </RadioIndicator>
                                                  <RadioLabel color={textColor}>{getTermFromDictionary(language, 'private')}</RadioLabel>
                                             </Radio>
                                             <Radio value={true} my="$1">
                                                  <RadioIndicator mr="$2">
                                                       <RadioIcon as={CircleIcon} strokeWidth={1} />
                                                  </RadioIndicator>
                                                  <RadioLabel color={textColor}>{getTermFromDictionary(language, 'public')}</RadioLabel>
                                             </Radio>
                                        </HStack>
                                   </RadioGroup>
                              </FormControl>
                         </ModalBody>
                         <ModalFooter>
                              <ButtonGroup>
                                   <Button variant="outline" onPress={toggle} borderColor={theme['colors']['primary']['500']}>
                                        <ButtonText color={theme['colors']['primary']['500']}>{getTermFromDictionary(language, 'close_window')}</ButtonText>
                                   </Button>
                                   <Button
                                        bgColor={theme['colors']['primary']['500']}
                                        isLoading={loading}
                                        isLoadingText={getTermFromDictionary(language, 'creating_list', true)}
                                        onPress={async () => {
                                             setAdding(true);
                                             await createList(title, description, isPublic, library.baseUrl).then(async (res) => {
                                                  let status = 'success';
                                                  if (!res.success) {
                                                       status = 'danger';
                                                  }
                                                  queryClient.invalidateQueries({ queryKey: ['user', library.baseUrl, language] });
                                                  queryClient.invalidateQueries({ queryKey: ['lists', user.id, library.baseUrl, language] });
                                                  toggle();
                                                  setLoading(true);
                                                  popAlert(getTermFromDictionary(language, 'list_created'), res.message, status);
                                             });
                                        }}>
                                        <ButtonText color={theme['colors']['primary']['500-text']}>{getTermFromDictionary(language, 'create_list')}</ButtonText>
                                   </Button>
                              </ButtonGroup>
                         </ModalFooter>
                    </ModalContent>
               </Modal>
          </Center>
     );
};

export default CreateList;