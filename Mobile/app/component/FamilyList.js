import React from 'react';
import {StyleSheet, View} from "react-native";
import FamilyCard from "./FamilyCard";

const FamilyList = familyMembers =>
  <View>
    {familyMembers.map((person, i) => {
      return (
        <FamilyCard key={i} style={styles.familyCard} personProps={person}/>
      )
    })}
  </View>;

const styles = StyleSheet.create({
  familyCard: {
    flex: 0.8
  }
});

export default FamilyList;
