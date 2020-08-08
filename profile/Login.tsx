import React, {useState, useEffect} from "react";
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import {useForm, Controller} from 'react-hook-form';
import { useNavigation } from "@react-navigation/native";
import { Layout, Button, Text, Input } from "@ui-kitten/components";
import { AntDesign } from "@expo/vector-icons";
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-sign-in';
import {firebase, auth} from '../firebase';
import { RenderProps } from "../App";

interface FormData {
  email: string;
  password: string;
}

function Login({rerenderApp, setRerenderApp, currUser}: RenderProps) {

  const { control, setError, handleSubmit, errors, reset } = useForm<
    FormData
  >();
  const navigation = useNavigation();

  const google = <AntDesign name="google" size={24} color="white" />;
  const facebook = <AntDesign name="facebook-square" size={24} color="white" />;

  const googleIcon = () => (
    <TouchableWithoutFeedback>{google}</TouchableWithoutFeedback>
  );
  const facebookIcon = () => (
    <TouchableWithoutFeedback>{facebook}</TouchableWithoutFeedback>
  );

  const onSubmit = handleSubmit(async ({email, password}) => {
    await auth.signInWithEmailAndPassword(email, password)
      .catch((error) => {
        setError('email', {
          type: 'firebase',
          message: error.message,
        });
      });
    reset({email: '', password: ''});
    navigation.navigate("Feed");
  });

  const facebookSignIn = async () => {
    try {
      await Facebook.initializeAsync();
      const result = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (result.type === 'success') {
        const credential = firebase.auth.FacebookAuthProvider.credential(result.token);
        auth.signInWithCredential(credential).catch((error) => {
          console.log(error);
        });
      } else {
        // type === 'cancel'
        console.log('Did not work');
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };

  const googleSignIn = async () => {
    try {
      await Google.initAsync();
      const {type, user} = await Google.signInAsync();
      if (type === 'success') {
        const {idToken, accessToken} = user!.auth!;
        const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
        auth.signInWithCredential(credential).catch((error) => {
          console.log(error);
        });
      } else {
        console.log('Did Not Work');
      }
    } catch(error) {
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Layout style={styles.background} level="3">
        <Controller
          control={control}
          render={({onChange, onBlur, value}) => (
            <Input
              style={styles.inputField}
              onBlur={onBlur}
              placeholder="Email address"
              value={value}
              onChangeText={(value) => onChange(value)}
              size="large"
            />
          )}
          name='email'
          rules={{required: true}}
          defaultValue=''
        />
        {errors.email?.type === "required" && (
          <Text style={styles.errorText}>This field is required</Text>
        )}
        <Controller
          control={control}
          render={({onChange, onBlur, value}) => (
            <Input
              style={styles.inputField}
              placeholder="Password"
              onBlur={onBlur}
              value={value}
              onChangeText={(value) => onChange(value)}
              size="large"
              secureTextEntry
            />
          )}
          name="password"
          rules={{ required: true}}
          defaultValue=""
        />
        {errors.password?.type === 'required' && (
          <Text style={styles.errorText}>This field is required.</Text>
        )}
        {errors.email?.type === 'firebase' && (
          <Text style={styles.errorText}>{errors.email?.message}</Text>
        )}
        <Button style={styles.button} onPress={onSubmit}>
          Login with Email
        </Button>
        <View style={styles.altContainer}>
          <Button
            style={styles.altGoogle}
            status="success"
            accessoryRight={googleIcon}
            onPress={googleSignIn}
          >
            Sign in with Google
          </Button>
          <Button
            style={styles.altFacebook}
            status="info"
            accessoryRight={facebookIcon}
            onPress={facebookSignIn}
          >
            Sign in with Facebook
          </Button>
        </View>
        <View style={styles.registerContainer}>
          <Text>Don't have a Radius Account?</Text>
          <Button
            appearance="ghost"
            status="primary"
            onPress={() => navigation.navigate("Register")}
          >
            Register here
          </Button>
        </View>
      </Layout>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  altContainer: {
    flex: 1,
    justifyContent: "flex-start",
    width: "100%",
    paddingTop: 25,
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
    alignItems: "center",
    paddingTop: 50,
  },

  button: {
    margin: 10,
    width: "95%",
  },

  errorText: {
    color: "red",
    marginLeft: 10,
  },

  inputField: {
    paddingHorizontal: 10,
  },

  registerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 50,
  },
});

export default Login;