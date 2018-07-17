// Import React
import React from 'react';

// Import Spectacle Core tags
import {
  Deck,
  Heading,
  ListItem,
  List,
  Slide,
  Text,
  Image,
  S,
  CodePane,
  Code
} from 'spectacle';

// Import theme
import createTheme from 'spectacle/lib/themes/default';

// Require CSS
require('normalize.css');

const theme = createTheme(
  {
    primary: 'white',
    secondary: '#1F2022',
    tertiary: '#03A9FC',
    quartenary: '#CECECE'
  },
  {
    primary: 'Montserrat',
    secondary: 'Helvetica'
  }
);

export default class Presentation extends React.Component {
  render() {
    return (
      <Deck
        transition={['slide']}
        transitionDuration={500}
        theme={theme}
      >

        <Slide>
          <Heading size={1}>
            Migrating to React
          </Heading>
          <Heading size={5}>
            Greg Babiars
          </Heading>
          <Heading size={5}>
            @gbabiars
          </Heading>
        </Slide>

        <Slide>
          <Heading size={4}>
            Background
            <Text>
              (~2 years ago)
            </Text>
          </Heading>
          <List>
            <ListItem>AngularJS 1.5 App</ListItem>
            <ListItem>Controllers + Large Templates</ListItem>
            <ListItem>Two Way Data Bindings</ListItem>
            <ListItem>Scope Inheritance</ListItem>
            <ListItem>Route Based State Management</ListItem>
            <ListItem>Concatenated JS files with Gulp</ListItem>
          </List>
        </Slide>

        <Slide>
          <Heading size={4}>
            Time to Rewrite?
          </Heading>
          <Image src="rewrite.jpg" alt="Rewrite Image" height={500} />
        </Slide>

        <Slide>
          <Heading size={4}>
            Benefits of Migration
          </Heading>
          <List>
            <ListItem>Incremental improvement</ListItem>
            <ListItem>Spreads risk over time</ListItem>
            <ListItem>Able to keep up with new features</ListItem>
            <ListItem>Prevents team division</ListItem>
            <ListItem bold>Stability!</ListItem>
          </List>
        </Slide>

        <Slide>
          <Heading size={4}>
            Drawbacks of Migration
          </Heading>
          <List>
            <ListItem>Takes longer overall</ListItem>
            <ListItem>Perf cost of shipping two frameworks</ListItem>
            <ListItem>Requires interop of frameworks</ListItem>
          </List>
        </Slide>

        <Slide>
          <Heading size={4}>
            But before we introduce React...
          </Heading>
        </Slide>

        <Slide>
          <Heading size={4}>
            ...we need to clean up our architecture
          </Heading>
        </Slide>

        <Slide>
          <Heading size={4}>
            Bundle with Webpack
          </Heading>
          <List>
            <ListItem>Start with require.context</ListItem>
            <ListItem>Eventually switch to ES modules</ListItem>
            <ListItem>Extract framework agnostic code</ListItem>
            <ListItem>Leverage Webpack's ecosystem</ListItem>
          </List>
        </Slide>

        <Slide>
          <Heading size={4}>
            Components
          </Heading>
          <List>
            <ListItem>Convert controllers to components</ListItem>
            <ListItem>One way data binding</ListItem>
            <ListItem>Callbacks to bubble events up</ListItem>
            <ListItem>Eliminate scope inheritance</ListItem>
            <ListItem>Limit the number of injections</ListItem>
          </List>
        </Slide>

        <Slide>
          <Heading size={4}>
            Redux
          </Heading>
          <List>
            <ListItem>Framework agnostic</ListItem>
            <ListItem>Moves fetching logic to store</ListItem>
            <ListItem>Components focus on rendering logic</ListItem>
          </List>
        </Slide>

        <Slide>
          <Text>
            Now that our components are focused on rendering, we can swap out the rendering with some thing like...<S type="bold">React</S>!
          </Text>
        </Slide>

        <Slide>
          <Heading size={4}>
            Strategy
          </Heading>
          <List>
            <ListItem>Migrate a component at a time</ListItem>
            <ListItem>Start with leaf components first</ListItem>
            <ListItem>Use context for cross cutting concerns</ListItem>
            <ListItem>Maintain existing DOM structure</ListItem>
            <ListItem>Don't render AngularJS inside React</ListItem>
            <ListItem>Don't leak AngularJS into components</ListItem>
          </List>
        </Slide>

        <Slide>
          <Heading size={5}>
            Example 1: Basic Props
          </Heading>
          <Text>
            Use AngularJS's <Code>$onChanges</Code> hook to render the AngularJS component as a React component and pass the bindings as props.
          </Text>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            const helloWorldComponent = {
              template: \`<h1>Hello {{$ctrl.name}}</h1>\`,
              bindings: {
                name: '<'
              }
            };

            // <hello-world name="'John'"></hello-world>
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            const HelloWorld = ({ name }) => <h1>{name}<h1>;

            const helloWorldComponent = {
              bindings: {
                name: '<'
              },
              controller: ($element) => {
                this.$onChanges = () => {
                  ReactDOM.render(
                    <HelloWorld name={this.name} />,
                    $element[0]
                  );
                };
            };

            // <hello-world name="'John'"></hello-world>
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <Heading size={5}>
            Example 2: Callbacks
          </Heading>
          <Text>
            Use a callback function to wrap AngularJS service calls and pass the callback to the React component as a prop.
          </Text>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            const template = \`
              <button ng-click="$ctrl.onClick()">
                Click Me!
              </button>
            \`;
            const doSomethingComponent = {
              template,
              controller: (myService) => {
                this.onClick = () => {
                  myService.doSomething();
                };
              }
            };
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            const DoSomething = ({ onClick }) => (
              <button onClick={onClick}>Click Me!</button>
            );

            const doSomethingComponent = {
              controller: ($element, myService) => {
                const onClick = () => {
                  myService.doSomething();
                };

                this.$onInit = () => {
                  ReactDOM.render(
                    <DoSomething onClick={onClick} />,
                    $element[0]
                  );
                }
              }
            };
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <Heading size={5}>
            Example 3: String Components
          </Heading>
          <Text>
            Render a string for a React component to implement a cross cutting concern like formatting to lowercase similar to AngularJS's filter.
          </Text>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            const lowercaseFilter = () => text => text.toLowerCase();

            const helloWorldComponent = {
              template: \`<h1>Hello {{$ctrl.name | lowercase}}</h1>\`,
              bindings: {
                name: '<'
              }
            };
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            const Lowercase = ({ text }) => text.toLowerCase();
            const HelloWorld = ({ name }) => (
              <h1>
                <Lowercase text={name} />
              <h1>
            );

            const helloWorldComponent = {
              bindings: {
                name: '<'
              },
              controller: ($element) => {
                this.$onChanges = () => {
                  ReactDOM.render(
                    <HelloWorld name={this.name} />,
                    $element[0]
                  );
                };
            };
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <Heading size={5}>
            Example 4: Using Fragment
          </Heading>
          <Text>
            To maintain existing markup, we need to be able to support components that have multiple top level elements, which we can do using React Fragments.
          </Text>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            const myCardComponent = {
              template: \`
                <h3>{{$ctrl.header}}</h3>
                <div>{{$ctrl.body}}</div>
              \`,
              bindings: {
                header: '<',
                body: '<'
              }
            };
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            const MyCard = ({ header, body }) => (
              <React.Fragment>
                <h3>{header}</h3>
                <div>{body}</div>
              </React.Fragment>
            );
            const myCardComponent = {
              bindings: {
                header: '<',
                body: '<'
              },
              controller: ($element) => {
                this.$onChanges = () => {
                  ReactDOM.render(
                    <MyCard header={this.header} body={this.body} />,
                    $element[0]
                  );
                }
              }
            };
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <Heading size={5}>
            Example 5: Using Context
          </Heading>
          <Text>
            One of the common needs is handling cross cutting concerns while being able to interop with the existing services. We need to be able to do this without polluting props to our components. React's Context api allows us to do just this.
          </Text>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            const translateFilter =
              translate => name => translate(name);

            const helloWorldComponent = {
              template: \`<h1>{{'Hello World' | translate}}</h1>\`
            };
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            const TranslateContext = React.createContext(key => key);

            const Translate = ({ name }) => (
              <TranslateContext.Consumer>
                {translate => translate(name)}
              </TranslateContext.Consumer>
            );

            const HelloWorld = () => (
              <h1><Translate name="Hello World" /></h1>
            );
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            const helloWorldComponent = {
              controller: (translate) => {
                this.$onInit = () => {
                  ReactDOM.render(
                    <TranslateContext.Provider value={translate}>
                      <HelloWorld />
                    </TranslateContext.Provider>,
                    $element[0]
                  );
                }
              }
            };
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <Heading size={5}>
            Example 6: Using Children
          </Heading>
          <Text>
            We can utilize children to create wrappers that have side effects but don't add extra markup to the DOM similar to AngularJS directives.
          </Text>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            const scrollTopDirective = {
              controller: () => {
                this.$onInit = () => {
                  window.scrollTo(0, 0);
                }
              }
            };

            // <div scroll-top>Stuff goes here</div>
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            class ScrollTop extends React.Component {
              componentDidMount() {
                window.scrollTo(0, 0);
              }
              render() {
                return this.props.children;
              }
            }

            // <ScrollTop>
            //   <div>Stuff goes here</div>
            // </ScrollTop>
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <Heading size={5}>
            Example 7: Composition
          </Heading>
          <Text>
            One of React's greatest strengths is being able to compose together components with flexibility and reusability.
          </Text>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            const template = \`
            <div class="details-card">
              <div class="details-card__header" ng-transclude="header">
              </div>
              <div class="details-card__body" ng-transclude="body">
              </div>
            </div>
            \`;
            const detailsCardComponent = {
              template,
              transclude: {
                header: '?detailsCardHeader',
                body: '?detailsCardBody'
              }
            };
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            <details-card>
              <details-card-header>
                Header Text
              </details-card-header>
              <details-card-body>
                <p>
                  Body Content
                </p>
              </details-card-body>
            </div>
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            const DetailsCard = ({ children }) => {
              const arr = React.Children.toArray(children);
              const header = arr.filter(x =>
                x.type.name === "DetailsCardHeader");
              const body = arr.filter(x =>
                x.type.name === "DetailsCardBody");
              return (
                <div className="details-card">
                  {header}
                  {body}
                </div>
              );
            };
            const DetailsCardHeader = ({ children }) => (
              <div className="details-card__header">{children}</div>
            );
            const DetailsCardBody = ({ children }) => (
              <div className="details-card__body">{children}</div>
            );
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            <DetailsCard>
              <DetailsCardHeader>
                Header Text
              </DetailsCardHeader>
              <DetailsCardBody>
                <p>Body Content</p>
              </DetailsCardBody>
            </DetailsCard>
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            const DetailsCard = ({ header, body }) => {
              return (
                <div className="details-card">
                  {header ? (
                    <div className="details-card__header">
                      {header}
                    </div>
                  ) : null}
                  {body ? (
                    <div className="details-card__body">
                      {body}
                    </div>
                  ) : null}
                </div>
              );
            };
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            <DetailsCard
              header="Header Text"
              body={<p>Body Content</p>}
            />
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            const DetailsCard = ({ header, children }) => {
              return (
                <div className="details-card">
                  {header ? (
                    <div className="details-card__header">
                      {header}
                    </div>
                  ) : null}
                  {children ? (
                    <div className="details-card__body">
                      {children}
                    </div>
                  ) : null}
                </div>
              );
            };
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <CodePane lang="js" source={`
            <DetailsCard
              header="Header Text">
              <p>Body Content</p>
            </DetailsCard>
          `} style={{ fontSize: 20 }}/>
        </Slide>

        <Slide>
          <Heading size={4}>
            Lessons Learned
          </Heading>
          <List>
            <ListItem>Context is awesome!</ListItem>
            <ListItem>Decompose to smaller components</ListItem>
            <ListItem>Write tests as you go</ListItem>
            <ListItem>Small iterative chunks</ListItem>
            <ListItem>Be patient</ListItem>
          </List>
        </Slide>

        <Slide>
          <Heading>
            Thank you!
          </Heading>
        </Slide>

      </Deck>
    );
  }
}
