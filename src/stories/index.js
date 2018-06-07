import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import 'shoelace-css/dist/shoelace.css'

import { Button, Welcome } from '@storybook/react/demo'
import Login from '../Login'
import Contact from '../Contact'
import App from '../App'
import Landing from '../Landing'

const fakeHistory = {
  push: (url) => console.log('pushed', url),
  goBack: () => console.log('go back')
}
storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />)

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role='img' aria-label='so cool'>
        😀 😎 👍 💯
      </span>
    </Button>
  ))

storiesOf('App', module)
  .add('main App, not logged in', () => <App />)

storiesOf('Login', module)
  .add('login', () => <Login />)

storiesOf('Contact', module)
  .add('contact', () => <Contact deleteFxn={action('on delete')} key='asdasd-3411nasj' index='4' setContactsFxn={action('set contacts')}
    array={[{
      'id': 'f91a75ba-d376-49b4-906f-494c999c771a',
      'first': 'alex',
      'last': 'griffin',
      'email': 'alex.griffin@example.com',
      'dob': '1976-11-25 22:22:05',
      'phone': '0410559618',
      'company': 'Acerend',
      'title': 'Case Work Aide'
    } ]}
    entry={{
      'id': 'f91a75ba-d376-49b4-906f-494c999c771a',
      'first': 'alex',
      'last': 'griffin',
      'email': 'alex.griffin@example.com',
      'dob': '1976-11-25 22:22:05',
      'phone': '0410559618',
      'company': 'Acerend',
      'title': 'Case Work Aide'
    }} />
  )

storiesOf('Landing', module)
  .add('landing', () => <Landing history={fakeHistory} />)
