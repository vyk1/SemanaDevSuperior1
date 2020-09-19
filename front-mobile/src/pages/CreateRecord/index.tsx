import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { RectButton, TextInput } from 'react-native-gesture-handler';
import Picker from 'react-native-picker-select';
import Header from '../../components/Header';
import PlatformCard from './PlatformCard';
import { Game, GamePlatform } from './types';
import { FontAwesome5 as Icon } from '@expo/vector-icons';

const BASE_URL = "http://192.168.0.105:8080"

const mapSelectedValues = (games: Game[]) => {
    return games.map(g => ({
        ...g,
        label: g.title,
        value: g.id
    }))
}

const CreateRecord = () => {

    const [platform, setPlatform] = useState<GamePlatform>()
    const [selectedGame, setSelectedGame] = useState('')
    const [allGames, setAllGames] = useState<Game[]>([]);
    const [filteredGames, setFilteredGames] = useState<Game[]>([]);
    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [loaded, setLoaded] = useState(false);

    const handleChangePlatform = (selectedPlatform: GamePlatform) => {
        setPlatform(selectedPlatform)
        const gamesByPlatform = allGames.filter(game => game.platform === selectedPlatform)
        setFilteredGames(gamesByPlatform)
    }

    const handleSubmit = () => {
        setLoaded(false)
        const payload = { name, age, gameId: selectedGame }
        if (!name || !age || !selectedGame) {
            setLoaded(true)
            return Alert.alert("Formulário incompleto", "Por favor, preencha completamente o formulário")
        }

        Axios.post(`${BASE_URL}/records`, payload)
            .then(() => {
                setName('')
                setAge('')
                setSelectedGame('')
                setPlatform(undefined)
                Alert.alert("Sucesso!")
            })
            .catch(e => {
                console.log("Falhou.", e)
                Alert.alert('Erro', 'Ocorreu um erro ao salvar os dados...')
            }).finally(() => {
                setLoaded(true)
            })
    }

    useEffect(() => {
        setLoaded(false)
        Axios.get(`${BASE_URL}/games`)
            .then(res => {
                const selectedValues = mapSelectedValues(res.data)
                setAllGames(selectedValues)
            })
            .catch(e => {
                console.log("Falhou.", e)
                Alert.alert('Erro', 'Ocorreu um erro ao listar os jogos ...')
            }).finally(() => {
                setLoaded(true)
            })
    }, [platform]);

    if (!loaded) {
        return (
            <>
                <Header />
                <View style={styles.container}>
                    <ActivityIndicator color="#fff" />
                </View>
            </>
        )
    }

    return (
        <>
            <Header />
            <View style={styles.container}>
                <TextInput
                    onChangeText={val => setName(val)}
                    value={name}
                    placeholder="Nome"
                    style={styles.inputText}
                    placeholderTextColor="#9e9e9e"
                />
                <TextInput
                    onChangeText={val => setAge(val)}
                    value={age}
                    placeholder="Idade"
                    keyboardType="numeric"
                    maxLength={3}
                    style={styles.inputText}
                    placeholderTextColor="#9e9e9e"
                />
                <View style={styles.platformContainer}>
                    <PlatformCard
                        activePlatform={platform}
                        icon="laptop"
                        onChange={(selectedPlatform) => handleChangePlatform(selectedPlatform)}
                        platform={"PC"} />
                    <PlatformCard
                        activePlatform={platform}
                        icon="xbox"
                        onChange={(selectedPlatform) => handleChangePlatform(selectedPlatform)}
                        platform={"XBOX"} />
                    <PlatformCard
                        activePlatform={platform}
                        icon="playstation"
                        onChange={(selectedPlatform) => handleChangePlatform(selectedPlatform)}
                        platform={"PLAYSTATION"} />
                </View>

                <Picker
                    style={pickerStyles}
                    placeholder={{ label: "Selecione o game", value: null }}
                    value={selectedGame}
                    items={filteredGames}
                    Icon={() => <Icon name="chevron-down" color={"#9e9e9e"} size={25} />}
                    onValueChange={val => setSelectedGame(val)}
                />
                <View style={styles.footer}>
                    <RectButton style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>SALVAR</Text>
                    </RectButton>
                </View>
            </View>
        </>
    );
}
const pickerStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        borderRadius: 10,
        color: '#ED7947',
        paddingRight: 30,
        fontFamily: "Play_700Bold",
        height: 50
    },
    inputAndroid: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        borderRadius: 10,
        color: '#ED7947',
        paddingRight: 30,
        fontFamily: "Play_700Bold",
        height: 50
    },
    placeholder: {
        color: '#9E9E9E',
        fontSize: 16,
        fontFamily: "Play_700Bold",
    },
    iconContainer: {
        top: 10,
        right: 12,
    }
})
const styles = StyleSheet.create({
    container: {
        marginTop: '15%',
        paddingRight: '5%',
        paddingLeft: '5%',
        paddingBottom: 50
    },
    inputText: {
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 10,
        color: '#ED7947',
        fontFamily: "Play_700Bold",
        fontSize: 16,
        paddingLeft: 20,
        marginBottom: 21
    },
    platformContainer: {
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footer: {
        marginTop: '15%',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#00D4FF',
        flexDirection: 'row',
        borderRadius: 10,
        height: 60,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontFamily: "Play_700Bold",
        fontWeight: 'bold',
        fontSize: 18,
        color: '#0B1F34',
    }
});

export default CreateRecord;