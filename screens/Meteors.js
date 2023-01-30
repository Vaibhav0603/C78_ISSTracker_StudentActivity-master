import React, { Component } from 'react';
import { Text, View,ImageBackground,Image,FlatList, StyleSheet,Platform,StatusBar, Dimensions } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-web';
export default class MeteorScreen extends Component {
    constructor(props){
        super(props)
        this.state={
            meteors:{}
        }
    }
    getMeteors=()=>{
        axios
        .get("https://api.nasa.gov/neo/rest/v1/feed?api_key=qZBO0b0e8ndERgzVBzTC7LjKobGpH9Ms5Yxhutpg")
        .then(response=>{
            this.setState({meteors:response.data.near_earth_objects})
        })
        .catch(error=>{
            alert(error.message)
        })
    }
    componentDidMount(){
        this.getMeteors()
    }
    renderItem=({item})=>{
        let meteor=item
        let bg_img,size,speed
        if(meteor.threat_score<=30){
            bg_img=require("..assets/meteor_bg1.png")
            speed=require("..assets/meteor_speed3.gif")
            size=100
        }
        else if(meteor.threat_score<=75){
            bg_img=require("..assets/meteor_bg2.png")
            speed=require("..assets/meteor_speed3.gif")
            size=150
        }
        else{
            bg_img=require("..assets/meteor_bg3.png")
            speed=require("..assets/meteor_speed3.gif")
            size=200
            
        }
        return(
            <View>
                <ImageBackground source= {bg_img} style={StyleSheet.backgroundImage}>
                    <View style={styles.gifContainer}>
                        <Image source={speed}style= {{
                            width:size,
                            height:size,
                            alignSelf:"center"

                        }}></Image>
                    </View>
                    <View>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <Text style={styles.cardText}>closest to Earth-{item.close_approach_data[0].close_approach_date_full}</Text>
                        <Text style={styles.cardText} > minimun diameter (km)-{item.estimated_diameter.kilometers.estimated_diameter_min}</Text>
                        <Text style={styles.cardText}>maxmimum diameter (km)-{item.estimated_diameter.kilometers.estimated_diameter_max}</Text>
                        <Text style={styles.cardText}> velocity(km/h)-{item.close_approach_data[0].relative_velocity.kilometers_per_hour}</Text>
                        <Text style={styles.cardText}>missing at by (km)-{item.close_approach_data[0].miss_distance.kilometers}</Text>
                    </View>
                </ImageBackground>
            </View>

        )
    }
    keyExtractor=(item,index)=>index.toString()
    render() {
        if(Object.keys(this.state.meteors).length === 0){
            return(
                <View style={{
                    flex:1,
                    justifyContent:"center",
                    alignItems:"center"
                
    }}>
                    <Text> Loading...</Text>
                </View>
            )

        }
        else{
            let meteor_arr=Object.keys(this.state.meteors).map(meteor_date=>{
                return this.state.meteors[meteor_date]
            }
            )
            let meteors=[].concat.apply([],meteor_arr)
            meteors.forEach(function(element){
                let diameter=(element.estimated_diameter.kilometers.estimated_diameter_min+
                    element.estimated_diameter.kilometers.estimated_diameter_max
                    )/2
                    let threatScore=(diameter/element.close_approach_data[0].miss_distance.kilometers)/1000000000
                    element.threat_score=threatScore

            })
            meteors.sort(function(a,b){
                return b.threat_score-a.threat_score
            })
            return (
                <View style={styles.container}>
                   <SafeAreaView style={styles.safeArea}>
                    <FlatList 
                    renderItem={this.renderItem}
                    data={meteors}
                    keyExtractor={this.keyExtractor}
                    horizontal={true}

                    />
                    
                   </SafeAreaView>
                    
                </View>
            )
        }
       
    }
}
const styles=StyleSheet.create({
    container:{
        flex:1,

    },
    safeArea:{
        marginTop:Platform.OS==="android"? StatusBar.currentHeight:0
    },
    backgroundImage:{
        flex:1,
        resizeMode:"cover",
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,

    },
    gifContainer:{
        justifyContent:"center",
        alignItems:"center",
        flex:1,

    },
    cardTitle:{
        fontSize:20,
        marginBottom:10,
        fontWeight:"bold",
        color:"white"
    },
    cardText:{
        color:"white"
    }
})
