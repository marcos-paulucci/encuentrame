import React, {Component} from 'react'
import {View, StyleSheet, Alert, Text, TouchableHighlight, TouchableOpacity} from "react-native";
import TabProgressTracker from "./TabProgressTracker";
import LoadingIndicator from "../LoadingIndicator";

//
// - get the questions
// - build the views
// - pass them to the progress tracker
//

const NULL_ANSWER = {
  getValue: () => null
};

export default class SupplyInfo extends Component {

  state = {
    currentQuestionIndex: 0
  };

  static defaultProps = {
    questions: [],
    onSubmit: () => {console.log("No more questions, submit!")},
    onClose: () => {console.log("View closed, going back...")}
  };

  onAnswerPress = (answerIndex) => {
    let question = this.props.questions[this.state.currentQuestionIndex];
    let answer = question.answers[answerIndex] || NULL_ANSWER;
    let answerValue = answer.getValue();
    question.onAnswer(answerValue);

    console.log(`
      question #${this.state.currentQuestionIndex}
      text: ${question.text},
      respuesta #${answerIndex},
      value: ${answerValue}
      button press!`
    );

    this.setNextAnswer();
  };

  setNextAnswer = () => {
    this.setState(({currentQuestionIndex}) => ({
        currentQuestionIndex: currentQuestionIndex + 1
      }),
      this.checkAllAnswered
    )
  };

  checkAllAnswered = () => {
    if (this.validateAllAnswers()) {
      this.props.onSubmit();
    }
  };

  validateAllAnswers = () => {
    let questionsCount = this.props.questions.length;
    let currentIndex = this.state.currentQuestionIndex;

    return currentIndex >= questionsCount;
  };

  renderAnswerItem = ({answerText, backgroundColor = "transparent", index, answersCount = 1}) => {
    return (
      <TouchableHighlight style={[styles.answerButton, {flex: 1 / answersCount}, {backgroundColor}]} key={index || 0}
                          onPress={() => this.onAnswerPress(index)}
                          underlayColor="white"
                          activeOpacity={0.5}
      >
        <Text style={styles.answerText} adjustsFontSizeToFit={true}>
          {answerText}
        </Text>
      </TouchableHighlight>
    );
  };

  renderDontKnowAnswer = () => {
    return this.renderAnswerItem({answerText: "No lo sé", backgroundColor: "gray"});
  };

  renderCurrentQuestionAnswers = () => {
    let currentQuestion = this.props.questions[this.state.currentQuestionIndex];
    let answers = currentQuestion.answers;
    let answersCount = answers.length;

    return answers.map((a, index) =>
      this.renderAnswerItem({answerText: a.text, backgroundColor: a.color, index, answersCount}));
  };

  render() {
    if(this.validateAllAnswers()) {
      return <LoadingIndicator text={"Gracias!"}/>
    }

    return <View style={styles.container}>
      <TabProgressTracker
        items={this.props.questions.map(q => q.text)}
        selectedIndex={this.state.currentQuestionIndex}
      />
      <View style={[{flex: 1}, styles.questionAnswersContainer]}>
        {this.renderCurrentQuestionAnswers()}
      </View>
      <View style={[{height: 100}, styles.questionAnswersContainer]}>
        {this.renderDontKnowAnswer()}
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D2D100', // '#D2D100', //#ecf0f1',
  },
  questionAnswersContainer: {
    alignItems: "center",
    justifyContent: 'center',
    width: "100%",
    paddingRight: 3,
    paddingLeft: 3,
  },
  answerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: "lightgray",
    margin: 3,
    padding: 3,
    width: "100%",
    height: "100%",
    borderRadius: 5
  },
  answerText: {
    textAlign: 'center',
    fontSize: 16
  }
});
