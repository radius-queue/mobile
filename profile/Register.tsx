import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Layout, Button, Text, Input } from "@ui-kitten/components";
import { useForm, Controller } from "react-hook-form";
import {auth} from '../firebase';
import {newCustomer} from '../util/api-functions';

import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { RenderProps } from "../App";
import { allNumbers, parsePhoneNum } from "../util/util-functions";

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
            const user = await newCustomer({firstName, lastName, email, uid, phone});
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

  const eyeOff = <Feather name="eye-off" size={24} color="white" />;
  const eye = <Feather name="eye" size={24} color="white" />;
  const google = <AntDesign name="google" size={24} color="white" />;
  const facebook = <AntDesign name="facebook-square" size={24} color="white" />;

  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  const renderInputIcon = () => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      {!secureTextEntry ? eye : eyeOff}
    </TouchableWithoutFeedback>
  );
  const googleIcon = () => (
    <TouchableWithoutFeedback>{google}</TouchableWithoutFeedback>
  );
  const facebookIcon = () => (
    <TouchableWithoutFeedback>{facebook}</TouchableWithoutFeedback>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Layout style={styles.background} level="3">
        <View style={styles.registerContainer}>
          <Text style={styles.header}>Create an account</Text>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <Input
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                placeholder="First Name"
              />
            )}
            name="firstName"
            rules={{ required: true, pattern: /[A-Za-z]/ }}
            defaultValue=""
          />
          {errors.firstName?.type === "required" && (
            <Text style={styles.errorText}>This field is required.</Text>
          )}
          {errors.firstName?.type === "pattern" && (
            <Text style={styles.errorText}>
              Must contain alphabetical characters only.
            </Text>
          )}

          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <Input
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                placeholder="Last Name"
              />
            )}
            name="lastName"
            rules={{ required: true, pattern: /[A-Za-z]/ }}
            defaultValue=""
          />
          {errors.lastName?.type === "required" && (
            <Text style={styles.errorText}>This field is required.</Text>
          )}
          {errors.lastName?.type === "pattern" && (
            <Text style={styles.errorText}>
              Must contain alphabetical characters only.
            </Text>
          )}

          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <Input
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={(value) => onChange(changePhone(value))}
                value={value}
                placeholder="Phone Number"
                keyboardType='number-pad'
                maxLength={13}
              />
            )}
            name="phoneNumber"
            rules={{ required:true, minLength: 13, maxLength: 13 }}
            defaultValue=""
          />
          {errors.phoneNumber?.type === "required" && (
            <Text style={styles.errorText}>This field is required.</Text>
          )}
          {errors.phoneNumber?.type === "minLength" && (
            <Text style={styles.errorText}>
              Not a valid phone number.
            </Text>
          )}
          {errors.phoneNumber?.type === "maxLength" && (
            <Text style={styles.errorText}>
              Not a valid phone number.
            </Text>
          )}

          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <Input
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                placeholder="Email Address"
              />
            )}
            name="email"
            rules={{
              required: true,
              pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
            }}
            defaultValue=""
          />
          {errors.email?.type === "required" && (
            <Text style={styles.errorText}>This field is required.</Text>
          )}
          {errors.email?.type === "pattern" && (
            <Text style={styles.errorText}>
              Please enter a valid email address.
            </Text>
          )}
          {errors.email?.type === "manual" && (
            <Text style={styles.errorText}>{errors.email?.message}</Text>
          )}
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <Input
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                placeholder="Password"
                secureTextEntry={secureTextEntry}
                accessoryRight={renderInputIcon}
              />
            )}
            name="password"
            rules={{ required: true, minLength: 6 }}
            defaultValue=""
          />
          {errors.password?.type === "required" && (
            <Text style={styles.errorText}>This field is required.</Text>
          )}
          {errors.password?.type === "minLength" && (
            <Text style={styles.errorText}>
              Password must be at least 6 characters.
            </Text>
          )}

          <Button
            style={styles.button}
            onPress={() => {
              onSubmit();
            }}
          >
            Register
          </Button>
        </View>
      </Layout>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column",
  },

  button: {
    margin: 10,
  },

  errorText: {
    color: "red",
    marginLeft: 10,
  },

  header: {
    paddingTop: 50,
    paddingHorizontal: 10,
    paddingBottom: 10,
    fontSize: 30,
    fontWeight: 'bold',
  },

  inputField: {
    width: "100%",
    paddingHorizontal: 10,
  },

  registerContainer: {
    flex: 1,
  },
});

export default Register;
