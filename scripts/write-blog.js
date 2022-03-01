const fs = require('fs')
const inquirer = require('inquirer')
const dedent = require('dedent')
const moment = require('moment')

const genFrontMatter = (answers) => {
    let d = new Date()
    const date = [
        d.getFullYear(),
        ('0' + (d.getMonth() + 1)).slice(-2),
        ('0' + d.getDate()).slice(-2),
    ].join('-')
    const tagArray = answers.tags.split(',')
    tagArray.forEach((tag, index) => (tagArray[index] = tag.trim()))
    const tags = "'" + tagArray.join("','") + "'"

    let frontMatter = dedent`---
  title: ${answers.title ? answers.title : 'Untitled'}
  description: ${answers.description ? answers.description : ' '}
  lead: ${answers.lead ? answers.lead : ' '}
  date: ${moment().format("YYYY-MM-DDTh:mm:ssZ")}
  lastmod: ${moment().format("YYYY-MM-DDTh:mm:ssZ")}
  images: []
  contributors: []
  tags: [${answers.tags ? tags : ''}]
  ---
  
  Start writing your blog here. Use Markdown syntax to write your blogs. If you are new to Markdown or unfamiliar with it, please refer to the [Markdown Guide](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) for more information. 
  To add images to your blog, download them inside the specific folder and add the path to the images in the blog. Make sure that the images have alternative text and a caption for accessibility. We also recommend meaningfully naming the images for future references.
  Before starting to work on the blog, make sure to add yourself as an author. You can do this by adding yourself as a contributor to the blog in the **content/contributors** folder by creating a new sub-folder and adding an **index.md** file inside it.

  While writing, keep the blogs concise, crisp and to the point. Avoid a biased opinion on a topic, mention both sides of the argument. After finishing the blog, make sure to raise a pull request where the maintainers can review and approve the blog. Ideally the maintainers might suggest some changes to the blog.
  Once the changes are implemented, the maintainers will merge the pull request and the blog would be automatically published through the GitHub Pages.
  `
    return frontMatter
}

inquirer
    .prompt([{
            name: 'title',
            message: 'Enter post title:',
            type: 'input',
        },
        {
            name: 'description',
            message: 'Enter post description:',
            type: 'input',
        },
        {
            name: 'lead',
            message: 'Enter post lead:',
            type: 'input',
        },
        {
            name: 'tags',
            message: 'Any Tags? Separate them with , or leave empty if no tags.',
            type: 'input',
        },
    ])
    .then((answers) => {
        let directoryPath = answers.title
            .toLowerCase()
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replace(/ /g, '-')
            .replace(/-+/g, '-')
        directoryPath = `${moment().format('YYYY-MM-DD')}-${directoryPath}`;
        const frontMatter = genFrontMatter(answers)
        const filePath = `content/blog/${directoryPath}/index.md`
        fs.mkdirSync(`content/blog/${directoryPath}`)
        fs.writeFile(filePath, frontMatter, (err) => {
            if (err) {
                throw err
            } else {
                console.log(`${filePath} created!`)
            }
        })
    })
    .catch((error) => {
        console.error(error)
        if (error.isTtyError) {
            console.log("Prompt was not rendered in the terminal.")
        } else {
            console.log('Error!')
        }
    })