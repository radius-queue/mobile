import React, {useState, useEffect} from "react";
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import {useForm, Controller} from 'react-hook-form';
import { useNavigation } from "@react-navigation/native";
import { Layout, Button, Text, Input } from "@ui-kitten/components";
import { AntDesign } from "@expo/vector-icons";
import {firebase, auth} from '../firebase';
import { RenderProps } from "../App";

interface FormData {
  email: string;
  password: string;
}

function Login({setUser, currUser}: RenderProps) {

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
      .then(() => {
        reset({email: '', password: ''});
        navigation.navigate("Feed");
      })
      .catch((error) => {
        setError('email', {
          type: 'firebase',
          message: error.message,
        });
      });
  });

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