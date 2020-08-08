import React from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  ImageProps,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Layout, Button, Text, Input, Icon } from "@ui-kitten/components";
import { useForm, Controller } from "react-hook-form";
import {auth} from '../firebase';
import {newCustomer} from '../util/api-functions';

import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { RenderProps } from "../App";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};


function Register({rerenderApp, setRerenderApp, currUser}: RenderProps) {
  const navigation = useNavigation();

  const { control, setError, handleSubmit, errors, reset } = useForm<
    FormData
  >();

  const onSubmit =  handleSubmit(async ({ firstName, lastName, email, password }) => {
    currUser.email='register';
    console.log('register.tsx (36) - registration begins ' + currUser.email);
    const shouldGo = await auth.createUserWithEmailAndPassword(email, password)
          .then(async (val: firebase.auth.UserCredential) => {
            const uid = val.user!.uid;
            currUser = await newCustomer({firstName, lastName, email, uid, phoneNumber: '2817325876'});
            setRerenderApp(rerenderApp+1);
            navigation.navigate('Feed');
            reset({firstName: '', lastName: '', email: '', password: ''});
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
          <Text style={styles.header}>Register with Email</Text>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <Input
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                placeholder="First Name"
                size="large"
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
                size="large"
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
                onChangeText={(value) => onChange(value)}
                value={value}
                placeholder="Email Address"
                size="large"
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
                size="large"
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
        <View style={styles.altContainer}>
          <Button
            style={styles.altGoogle}
            status="success"
            accessoryRight={googleIcon}
            onPress={() => {
              console.log("Google sign in");
            }}
          >
            Sign in with Google
          </Button>
          <Button
            style={styles.altFacebook}
            status="info"
            accessoryRight={facebookIcon}
            onPress={() => {
              console.log("Facebook sign in");
            }}
          >
            Sign in with Facebook
          </Button>
        </View>
      </Layout>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  altContainer: {
    flex: 1,
    justifyContent: "flex-end",
    margin: 10,
  },

  altGoogle: {
    marginBottom: 10,
  },

  altFacebook: {
    marginBottom: 10,
  },

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
