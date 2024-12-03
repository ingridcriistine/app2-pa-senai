import { Image, StyleSheet, Platform, Text, View, FlatList, TextInput, Button, ActivityIndicator } from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from "axios";

interface Character {
  id: number;
  name: string;
  image: string;
  status: string;
}

export default function HomeScreen() {

  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<string>("1");

  const fetchCharacters = async (pageNumber: string) => {
    try {
      const response = await axios.get(
        `https://rickandmortyapi.com/api/character/?page=${pageNumber}`
      );
      setCharacters(response.data.results);
    } catch (error) {
      console.error("Erro ao buscar personagens: ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCharacters(page);
  }, [page]);

  const renderCharacter = ({item}: {item: Character}) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image}/>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
    </View>
  )

  if(loading) {
    return(
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#5FFFB9FF"/>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.inputContainer}>
        <Text>1/42 - </Text>
        <TextInput
          style={styles.input}
          value={page}
          onChangeText={(text) => setPage(text)}
          keyboardType='numeric'
          placeholder='Digite o número da página'
        />
        <Button title="Buscar" onPress={() => fetchCharacters(page)}/>
      </View>
      <FlatList data={characters} keyExtractor={(item) => item.id.toString()} renderItem={renderCharacter} contentContainerStyle={styles.list}/>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8
  },
  image: {
    width: 100,
    height: 100
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: "center"
  },
  name: {
    fontSize: 16,
    fontWeight: "bold"
  },
  status: {
    fontSize: 14,
    color: "#666666"
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  list: {
    padding: 16
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f0f0"
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8
  }
});
