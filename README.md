# JSON:API ORM

`@tsmetadata/json-api-orm` provides a NoSQL object-relational mapping for JSON:API resource objects decorated with [@tsmetadata/json-api](https://github.com/tsmetadata/json-api).

- [🌱 Install](#-install)
- [🤖 Supported Drivers](#-supported-drivers)
- [📋 Feature Set](#-feature-set)
- [⚙️ Usage](#️-usage)
- [❓ FAQ](#-faq)

## 🌱 Install
```bash
npm install @tsmetadata/json-api-orm@latest
```

## 🤖 Supported Drivers
- DynamoDB (via. [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/))
  - To authenticate, please configure the global AWS SDK object or use environment variables.
  - Table names match, by default, the resource type.

## 📋 Feature Set
- [✨ Actions](#actions)
  - [Get](#get)
  - [Put](#put)
  - [Include](#include)

## ⚙️ Usage
### Actions
#### Get
The `get(cls: new (..._: any[]) => any), id: string)` action will get the resource with the given class and id from the underlying database.

```typescript
import { Resource, Id, Attribute } from '@tsmetadata/json-api';
import { get } from '@tsmetadata/json-api-orm';

@Resource('users')
class User {
  @Id()
  customerId: string;

  @Attribute()
  active: boolean;
}

const user1 = await get(User, 1);

if(user1 !== undefined) {
  console.log(user1.active)
}
```

#### Put
The `put(classInstance: object)` action will put (create or update) the resource from the given class instance.

```typescript
import { Resource, Id, Attribute } from '@tsmetadata/json-api';
import { put } from '@tsmetadata/json-api-orm';

@Resource('users')
class User {
  @Id()
  customerId: string;

  @Attribute()
  active: boolean;
}

const user = new User();
user.id = '1';
user.active = false;

await put(user);
```

#### Include
The `include(classInstance: object, relationshipKey: string, cls: new (..._: any[]) => any)` will get the full resource(s) for the given relationship.

```typescript
import { Resource, Id, Attribute, Relationship, type JSONAPIResourceLinkage } from '@tsmetadata/json-api';
import { include } from '@tsmetadata/json-api-orm';

@Resource('users')
class User {
  @Id()
  customerId: string;

  @Attribute()
  active: boolean;

  @Relationship('author')
  posts: Post[] | JSONAPIResourceLinkage;
}

@Resource('posts')
class Post {
  @Id()
  postId: string;

  @Attribute()
  description: string;

  @Relationship('posts')
  author: User | JSONAPIResourceLinkage;
}

const user = await get(User, '1');

/*
  user.posts is an array of `JSONAPIResourceIdentifierObject`. To turn this into an array of
  `Post`, we can do the following:
*/
await include(User, 'posts', Post);
```

## ❓ FAQ

### Q: Where can I learn more about JSON:API metadata decorators?
A: We have a standard library complete with serializers, deserializers, and all object types [here](https://github.com/tsmetadata/json-api).