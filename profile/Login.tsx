import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import {useForm, Controller} from 'react-hook-form';
import { useNavigation } from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import { auth } from '../firebase';
import { RenderProps } from "../App";
import { default as theme } from "../custom-theme.json";
import { TextInput } from "react-native-gesture-handler";

interface FormData {
  email: string;
  password: string;
}

function Login({setUser, currUser}: RenderProps) {

  const { control, setError, handleSubmit, errors, reset } = useForm<
    FormData
  >();
  const navigation = useNavigation();

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.screen}>
      <View style={styles.all}>
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.background}>
          <View style={styles.loginContainer}>
            <Text style={styles.header}>✍️ Log in</Text>

            {errors.email?.type === 'firebase' && (
              <Text style={[styles.errorText, styles.errorTextFirebase]}>{errors.email?.message}</Text>
            )}

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
              </View>
            </View>
            <Controller
              control={control}
              render={({onChange, onBlur, value}) => (
                <TextInput
                  style={styles.inputField}
                  onBlur={onBlur}
                  placeholder="Email Address"
                  value={value}
                  onChangeText={(value) => onChange(value)}
                  returnKeyType='done'
                />
              )}
              name='email'
              rules={{required: true, pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/}}
              defaultValue=''
            />


            <View style={styles.subheaderContainer}>
              <Text style={styles.subheader}>Password</Text>
              <View>
                {errors.password?.type === 'required' && (
                  <Text style={styles.errorText}>This field is required.</Text>
                )}
              </View>
            </View>
            <Controller
              control={control}
              render={({onChange, onBlur, value}) => (
                <TextInput
                  style={styles.inputField}
                  placeholder="Password"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={(value) => onChange(value)}
                  returnKeyType='done'
                  secureTextEntry
                />
              )}
              name="password"
              rules={{ required: true}}
              defaultValue=""
            />
            <Button style={styles.button} onPress={onSubmit}>
              Log in with email
            </Button>
          </View>
        </KeyboardAvoidingView>
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
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  all: {
    width: '100%',
    height: '100%',
  },

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

  errorTextFirebase: {
    marginVertical: 10,
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

  loginContainer: {
    backgroundColor: theme['color-basic-100'],
    padding: 10,
    width: '94%',
    borderRadius: 8,
  },

  registerContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: '10%',
    backgroundColor: theme['color-basic-800'],
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

export default Login;