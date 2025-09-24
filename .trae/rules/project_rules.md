1. THIS IS A MONOREPO PROJECT.
2. ALWAYS RUN TERMINAL WITH PATH:
- /packages/bot
- /packages/client
3. DO NOT RUN SCRIPTS FROM ROOT DIRECTORY.
4. STOP BUILDING FROM ROOT DIRECTORY.
5. RESPECT SEPARATE DEPLOYMENT BETWEEN BOT AND CLIENT.

# Display Components

While you might be familiar with embeds in Discord, there are more ways to style and format your app messages using **display components**, a comprehensive set of layout and content elements.

To use the display components, you need to pass the **IsComponentsV2** message flag (`MessageFlags`) when sending a message. You only need to use this flag when sending a message using the display components system, not when deferring interaction responses.

---

## ⚠️ WARNING

Opting into using this system by passing `IsComponentsV2` comes with a set of caveats:

* You **cannot** send content, poll, embeds, or stickers.
* You **cannot opt out** of using display components when editing a message.
* You **can opt in** to using display components when editing a message while explicitly setting content, poll, embeds, and stickers to `null`.
* Messages can have up to **40 total components** (nested components count!).
* The amount of text across all text display components cannot exceed **4000 characters**.
* All attached files must explicitly be referenced in a component (e.g., Thumbnail, Media Gallery, File).
* All components can be passed an optional, unique `id` field (32-bit integer). This is different from `custom_id` for interactive components.
* If `id` is not specified, Discord will automatically assign sequential values starting from 1. (`id: 0` is treated as empty).

If you want to work with the `id` (e.g., find and replace content later), you should **explicitly specify it**.

---

## # Text Display

Text Display components let you add **markdown-formatted text** to your message. They replace the `content` field when opting into display components.

### ⚠️ DANGER

Sending **user and role mentions** in text display components will **notify** them! You should control mentions with the `allowedMentions` option.

**Example:**

```js
const { TextDisplayBuilder, MessageFlags } = require('discord.js');

const exampleTextDisplay = new TextDisplayBuilder()
 .setContent('This text is inside a Text Display component! You can use **any __markdown__** available inside this component too.');

await channel.send({
 components: [exampleTextDisplay],
 flags: MessageFlags.IsComponentsV2,
});
```

---

## # Section

Sections represent text (1–3 Text Displays) with an **accessory** (image thumbnail or button).

**Example:**

```js
const { SectionBuilder, ButtonStyle, MessageFlags } = require('discord.js');

const exampleSection = new SectionBuilder()
 .addTextDisplayComponents(
  textDisplay => textDisplay
   .setContent('This text is inside a Text Display component!'),
  textDisplay => textDisplay
   .setContent('Using a section, you may only use up to three Text Display components.'),
  textDisplay => textDisplay
   .setContent('And you can place one button or one thumbnail component next to it!'),
 )
 .setButtonAccessory(
  button => button
   .setCustomId('exampleButton')
   .setLabel('Button inside a Section')
   .setStyle(ButtonStyle.Primary),
 );

await channel.send({
 components: [exampleSection],
 flags: MessageFlags.IsComponentsV2,
});
```

---

## # Thumbnail

A Thumbnail is similar to the `thumbnail` field in embeds. Thumbnails are added as **accessories inside a Section**, support alt text, and can be marked as spoilers.

**Example:**

```js
const { AttachmentBuilder, SectionBuilder, MessageFlags } = require('discord.js');

const file = new AttachmentBuilder('../assets/image.png');

const exampleSection = new SectionBuilder()
 .addTextDisplayComponents(
  textDisplay => textDisplay
   .setContent('This text is inside a Text Display component!'),
 )
 .setThumbnailAccessory(
  thumbnail => thumbnail
   .setDescription('alt text displaying on the image')
   .setURL('attachment://image.png'),
 );

await channel.send({
 components: [exampleSection],
 files: [file],
 flags: MessageFlags.IsComponentsV2,
});
```

---

## # Media Gallery

A Media Gallery displays a grid of up to **10 media attachments**. Each item can have optional alt text and be marked as a spoiler.

**Example:**

```js
const { AttachmentBuilder, MediaGalleryBuilder, MessageFlags } = require('discord.js');

const file = new AttachmentBuilder('../assets/image.png');

const exampleGallery = new MediaGalleryBuilder()
 .addItems(
  mediaGalleryItem => mediaGalleryItem
   .setDescription('alt text displaying on an image from the AttachmentBuilder')
   .setURL('attachment://image.png'),
  mediaGalleryItem => mediaGalleryItem
   .setDescription('alt text displaying on an image from an external URL')
   .setURL('https://i.imgur.com/AfFp7pu.png')
   .setSpoiler(true),
 );

await channel.send({
 components: [exampleGallery],
 files: [file],
 flags: MessageFlags.IsComponentsV2,
});
```

---

## # File

A File component displays an **uploaded file** within the message body. Multiple `File` components can be used in a single message.

**Example:**

```js
const { AttachmentBuilder, FileBuilder, MessageFlags } = require('discord.js');

const file = new AttachmentBuilder('../assets/guide.pdf');

const exampleFile = new FileBuilder()
 .setURL('attachment://guide.pdf');

await channel.send({
 components: [exampleFile],
 files: [file],
 flags: MessageFlags.IsComponentsV2,
});
```

---

## # Separator

A Separator adds vertical padding and an optional **visual divider** between components.

### ⚠️ SEPARATOR WARNING

If a Separator is used **without any other components**, the message will have no visible content.

**Example:**

```js
const { TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, MessageFlags } = require('discord.js');

const exampleTextDisplay = new TextDisplayBuilder()
 .setContent('This is inside a Text Display component!');

const exampleSeparator = new SeparatorBuilder()
 .setDivider(false)
 .setSpacing(SeparatorSpacingSize.Large);

await channel.send({
 components: [exampleTextDisplay, exampleSeparator, exampleTextDisplay],
 flags: MessageFlags.IsComponentsV2,
});
```

---

## # Container

A Container groups child components inside a **rounded box** with optional accent color (similar to embeds). Containers can be marked as **spoilers**.

**Example:**

```js
const { ContainerBuilder, UserSelectMenuBuilder, ButtonStyle, MessageFlags } = require('discord.js');

const exampleContainer = new ContainerBuilder()
 .setAccentColor(0x0099FF)
 .addTextDisplayComponents(
  textDisplay => textDisplay
   .setContent('This text is inside a Text Display component!'),
 )
 .addActionRowComponents(
  actionRow => actionRow
   .setComponents(
    new UserSelectMenuBuilder()
     .setCustomId('exampleSelect')
     .setPlaceholder('Select users'),
   ),
 )
 .addSeparatorComponents(
  separator => separator,
 )
 .addSectionComponents(
  section => section
   .addTextDisplayComponents(
    textDisplay => textDisplay
     .setContent('This is inside a Text Display component!'),
    textDisplay => textDisplay
     .setContent('And you can place one button or one thumbnail next to it!'),
   )
   .setButtonAccessory(
    button => button
     .setCustomId('exampleButton')
     .setLabel('Button inside a Section')
     .setStyle(ButtonStyle.Primary),
   ),
 );

await channel.send({
 components: [exampleContainer],
 flags: MessageFlags.IsComponentsV2,
});
```
