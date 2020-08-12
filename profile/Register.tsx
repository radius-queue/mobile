import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Layout, Button, Text } from "@ui-kitten/components";
import { useForm, Controller } from "react-hook-form";
import {auth} from '../firebase';
import {newCustomer} from '../util/api-functions';

import { Feather } from "@expo/vector-icons";
import { RenderProps } from "../App";
import { allNumbers, parsePhoneNum } from "../util/util-functions";
import { default as theme } from "../custom-theme.json";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
};


function Register({setUser, currUser}: RenderProps) {
  const navigation = useNavigation();
  const [phone, setPhone] = useState<string>('');
  const [phoneDisplay, setPhoneDisplay] = useState<string>('');

  /**
   * Takes the user phone number input and sets the current phone
   * number state and the phone number display state.
   * Ensures that only numbers are inputted before setting states.
   * @param {string} next The phone number inputted by the user.
   */
  const changePhone = (next: string) => {
    let isAllNumbers: boolean = true;
    let strippedToNumbers = '';
    for (let i: number = 0; i < next.length; i++) {
      if (allNumbers.includes(next[i])) {
        strippedToNumbers += next[i];
      }
    }
    if (isAllNumbers) {
      setPhone(strippedToNumbers);
      setPhoneDisplay(parsePhoneNum(strippedToNumbers));
      return parsePhoneNum(strippedToNumbers);
    }
  };

  const { control, setError, handleSubmit, errors, reset } = useForm<
    FormData
  >();

  const onSubmit =  handleSubmit(async ({ firstName, lastName, email, password }) => {
    const shouldGo = await auth.createUserWithEmailAndPassword(email, password)
          .then(async (newUser: firebase.auth.UserCredential) => {
            const uid = newUser.user!.uid;
            console.log(phone);
            const user = await newCustomer({firstName, lastName, email, uid, phoneNumber: phone});
            setUser(user);
            navigation.navigate('Feed');
            reset({firstName: '', lastName: '', email: '', password: ''});
            setPhone('');
            setPhoneDisplay('');
          }).catch((error) => {
            setError('email', {
              type: 'manual',
              message: error.message,
            });
          });
  });

  const eyeOff = <Feather name="eye-off" size={24}/>;
  const eye = <Feather name="eye" size={24}/>;

  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.background}>
        <View style={styles.registerContainer}>
          <Text style={styles.header}>Create an account</Text>
        
          <View style={styles.subheaderContainer}>
            <Text style={styles.subheader}>First Name</Text>
            <View>
              {errors.firstName?.type === "required" && (
                <Text style={styles.errorText}>This field is required.</Text>
              )}
              {errors.firstName?.type === "pattern" && (
                <Text style={styles.errorText}>
                  Invalid name.
                </Text>
              )}
            </View>
          </View>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                placeholder="First Name"
                returnKeyType='done'
              />
            )}
            name="firstName"
            rules={{ required: true, pattern: /^[A-Za-z\s\-]+$/ }}
            defaultValue=""
          />

          <View style={styles.subheaderContainer}>
            <Text style={styles.subheader}>Last Name</Text>
            <View>
              {errors.lastName?.type === "required" && (
                <Text style={styles.errorText}>This field is required.</Text>
              )}
              {errors.lastName?.type === "pattern" && (
                <Text style={styles.errorText}>
                  Invalid name.
                </Text>
              )}
            </View>
          </View>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                placeholder="Last Name"
                returnKeyType='done'
              />
            )}
            name="lastName"
            rules={{ required: true, pattern: /^[A-Za-z\s\-]+$/ }}
            defaultValue=""
          />

          <View style={styles.subheaderContainer}>
            <Text style={styles.subheader}>Phone Number</Text>
            <View>
              {errors.phoneNumber?.type === "required" && (
                <Text style={styles.errorText}>This field is required.</Text>
              )}
              {errors.phoneNumber?.type === "minLength" && (
                <Text style={styles.errorText}>
                  Invalid phone number.
                </Text>
              )}
              {errors.phoneNumber?.type === "maxLength" && (
                <Text style={styles.errorText}>
                  Invalid phone number.
                </Text>
              )}
            </View>
          </View>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={(value) => onChange(changePhone(value))}
                value={value}
                placeholder="Phone Number"
                keyboardType='number-pad'
                maxLength={13}
                returnKeyType='done'
              />
            )}
            name="phoneNumber"
            rules={{ required:true, minLength: 13, maxLength: 13 }}
            defaultValue=""
          />

          <View style={styles.subheaderContainer}>
            <Text style={styles.subheader}>Email Address</Text>
            <View>
              {errors.email?.type === "required" && (
                <Text style={styles.errorText}>This field is required.</Text>
              )}
              {errors.email?.type === "pattern" && (
                <Text style={styles.errorText}>
                  Invalid email.
                </Text>
              )}
              {errors.email?.type === "manual" && (
                // <Text style={styles.errorText}>{errors.email?.message}</Text>
                <Text style={styles.errorText}>Email already in use.</Text>
              )}
            </View>
          </View>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                placeholder="Email Address"
                keyboardType='email-address'
                returnKeyType='done'
              />
            )}
            name="email"
            rules={{
              required: true,
              pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
            }}
            defaultValue=""
          />

          <View style={styles.subheaderContainer}>
            <Text style={styles.subheader}>Password</Text>
            <View>
              {errors.password?.type === "required" && (
                <Text style={styles.errorText}>This field is required.</Text>
              )}
              {errors.password?.type === "minLength" && (
                <Text style={styles.errorText}>
                  Must be at least 6 characters.
                </Text>
              )}
            </View>
          </View>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.inputField, styles.passwordText]}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  placeholder="Password"
                  secureTextEntry={secureTextEntry}
                  returnKeyType='done'
                />
                <TouchableWithoutFeedback onPress={toggleSecureEntry}>
                  {!secureTextEntry ? eye : eyeOff}
                </TouchableWithoutFeedback>
              </View>
            )}
            name="password"
            rules={{ required: true, minLength: 6 }}
            defaultValue=""
          />

          <Button
            style={styles.button}
            onPress={() => {
              onSubmit();
            }}
          >
            Register
          </Button>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: theme['color-basic-800'],
  },

  button: {
    marginTop: 4,
  },

  errorText: {
    color: "red",
    fontSize: 12,
  },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme['color-basic-1100'],
    marginBottom: 8,
  },

  inputField: {
    borderWidth: 1,
    borderColor: theme['color-basic-100'],
    marginBottom: 6,
    backgroundColor: theme['color-basic-400'],
    height: 36,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 15,
  },

  passwordContainer: {
    display:'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  passwordText: {
    width: '100%',
    marginRight: -32,
  },

  registerContainer: {
    backgroundColor: theme['color-basic-100'],
    padding: 10,
    width: '94%',
    borderRadius: 8,
  },

  screen: {
    backgroundColor: theme['color-basic-1000'],
    height: '100%',
  },

  subheader: {
    color: theme['color-basic-1100'],
    fontSize: 12,
  },

  subheaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 2,
    marginBottom: 2,
  },
});

export default Register;
