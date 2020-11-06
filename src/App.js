import "./App.css";
import React, { Component } from "react";
//import alertify from "alertifyjs";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Container,
  Table,
  Badge,
} from "reactstrap";

export default class App extends Component {
  state = {
    generatedNumber: Number,
    estimatedNumbers: [],
    whichGuess: Number,
    results: [],
    estimatedNumber: Number,
    result: Map,
    plus: Number,
    minus: Number,
  };

  componentDidMount() {
    let generated = this.createRandomNumber();
    this.setState({ generatedNumber: generated });
    let whichGuessNumber = 0;
    this.setState({ whichGuess: whichGuessNumber });
  }

  createRandomNumber = () => {
    var digits = "123456789".split(""); //İlk basamağının 0 olmaması için 0 alınmadı
    var firstDigit = this.shuffle(digits).pop();
    var randomNumber = firstDigit;
    digits.push("0");
    this.shuffle(digits);

    for (let i = 0; i < 5; i++) {
      randomNumber += digits.pop();
      i++;
    }
    return parseInt(randomNumber);
  };

  shuffle = (array) => {
    var currentIndex = array.length;
    var temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1; // Son elemandan başladığı için eksilerek gider.

      // Şu anki indexte bulunan eleman ile rastgele indexte bulunan eleman yer değiştirir.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };

  compareNumbers = (generatedNumber, estimatedNumber) => {
    var plus = 0,
      minus = 0;
    var generatedArray = generatedNumber.toString().split("");
    var estimatedArray = estimatedNumber.toString().split("");
    var result = new Map();

    for (let i = 0; i < generatedArray.length; ) {
      if (generatedArray[i] === estimatedArray[i]) {
        generatedArray.splice(i, 1);
        estimatedArray.splice(i, 1);
        plus++;
        i = 0;
      } else {
        i++;
      }
    }

    for (let i = 0; i < generatedArray.length; i++) {
      for (let j = 0; j < estimatedArray.length; j++) {
        if (generatedArray[i] === estimatedArray[j]) {
          minus++;
        }
      }
    }

    result.set("plus", plus).set("minus", minus);

    return result;
  };

  handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    this.setState({
      estimatedNumbers: [
        ...this.state.estimatedNumbers,
        this.state.estimatedNumber,
      ],
    });

    console.log(this.state.generatedNumber);

    this.setState({ whichGuess: this.state.whichGuess + 1 });

    let result = this.compareNumbers(
      this.state.generatedNumber,
      this.state.estimatedNumber
    );
    this.setState({ plus: result.get("plus") });
    this.setState({ minus: result.get("minus") });

    if (result.get("plus") === 4) {
      if (window.confirm("Tebrikler doğru sayıyı buldunuz! Sayı :" + this.state.generatedNumber)) {
        window.location.reload();
      }
    }

    if (this.state.whichGuess === 5) {
      if (window.confirm("Tahmin hakkın doldu. Tekrar oynamak ister misin?")) {
        window.location.reload();
      }
    }
  };

  render() {
    return (
      <div>
        <Container>
          <div className="container">
            <div className="row justify-content-md-center">
              <Table>
                <thead>
                  <tr>
                    <th>Tahminler</th>
                    <th>Sonuçlar</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.estimatedNumbers.map((estimated, index) => (
                    <tr>
                      <td>
                        <Form onSubmit={this.handleSubmit}>
                          <FormGroup key={index}>
                            <Label for="estimatedNumber">
                              {index + 1 + ". Tahmin"}
                            </Label>
                            <Input
                              name="estimatedNumber"
                              bsSize="lg"
                              type="number"
                              placeholder={estimated}
                              onChange={this.handleChange}
                              disabled
                            ></Input>
                          </FormGroup>
                          <Button type="submit" disabled>
                            Onayla
                          </Button>
                        </Form>
                      </td>
                      <td>
                      <div className="container mt-4">
                        <div className="row justify-content-md-center">
                          <h1>
                            <Badge color="success">
                              <div></div>
                            </Badge>
                            <Badge color="danger">
                              <div></div>
                            </Badge>
                          </h1>
                        </div>
                      </div>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                          <Label for="estimatedNumber">
                            {this.state.whichGuess + 1 + ". Tahmin"}
                          </Label>
                          <Input
                            maxLength="4"
                            name="estimatedNumber"
                            bsSize="lg"
                            type="number"
                            placeholder="Her basamağı farklı rakam olan 4 basamaklı bir sayı giriniz."
                            onChange={this.handleChange}
                          ></Input>
                        </FormGroup>
                        <Button color="success" type="submit">
                          Onayla
                        </Button>
                      </Form>
                    </td>
                    <td>
                      <div className="container mt-4">
                        <div className="row justify-content-md-center">
                          <h1>
                            <Badge color="success">
                              <div>{this.state.plus}</div>
                            </Badge>
                            <Badge color="danger">
                              <div>{this.state.minus}</div>
                            </Badge>
                          </h1>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
              <Button
                color="info"
                size="lg"
                onClick={() => window.location.reload()}
              >
                Yeniden Başla
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}
