var main = new Vue({
    el: '#main',
    data: {
        records: null
    },

    created: function () {
        this.loadData();
    },

    methods: {
        loadData: function () {
            this.records = new Array();
            var self = this;
            words.forEach(function (word) {
                self.records.push({ word: word.back[0].content, definition: word.back[1].content, sentence: word.back[2].content });
            }, this);
        }
    }
});

var getChildrenTextContent = function (children) {
    return children.map(function (node) {
        return node.children
            ? getChildrenTextContent(node.children)
            : node.text
    }).join('')
}

Vue.component('split-on-words', {
    render: function (createElement) {
        // create kebabCase id
        var headingId = getChildrenTextContent(this.$slots.default)
            .toLowerCase()
            .replace(/\W+/g, '-')
            .replace(/(^\-|\-$)/g, '')

        return createElement(
            'span',
            [
                createElement('a', {
                    attrs: {
                        name: headingId,
                        href: '#' + headingId
                    }
                }, this.$slots.default)
            ]
        )
    },
    props: {
        level: {
            type: Number,
            required: true
        }
    }
})

// function Sentence(sentence) {
//     this.original = sentence;


//     function() {
//         sentence.split(' ');
//     }

    
// }


var STORAGE_KEY = 'my-dictionary'
var myDictionary = {
    fetch: function () {
        var words = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        words.forEach(function (word, index) {
            word.id = index
        })
        myDictionary.uid = words.length
        return words
    },
    save: function (words) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(words))
    }
}

var dictionary = new Vue({
    el: '#dictionary',
    data: {
        words: myDictionary.fetch(),
        newWord: '',
        newTranslation: '',
        newDefinition: '',
        newSentence: ''
    },

    watch: {
        words: {
            handler: function (words) {
                myDictionary.save(words)
            },
            deep: true
        }
    },

    methods: {
        add: function () {
            this.words.push({
                id: myDictionary.uid++,
                word: newWord,
                translation: newTranslation,
                definition: newDefinition,
                sentence: newSentence
            });

            newWord = newDefinition = newSentence = newTranslation = '';
        }
    }
});